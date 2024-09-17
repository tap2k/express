import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FaGripLinesVertical } from 'react-icons/fa';

function getAudioDurationFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = function(event) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        audioContext.decodeAudioData(event.target.result, function(buffer) {
          const duration = buffer.duration;
          resolve(duration);
        }, function(e) {
          reject('Error decoding audio data: ' + e.message);
        });
      };
  
      reader.onerror = function(event) {
        reject('Error reading file: ' + event.target.error);
      };
  
      reader.readAsArrayBuffer(file);
    });
}

function formatTime (time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function Timeline({ contentItem, mediaRef, interval, pause, duration, setDuration, hidden, privateID, jwt, ...props }) {
    const [currentTime, setCurrentTime] = useState(0);
    const [endTime, setEndTime] = useState(contentItem.duration ? contentItem.start_time + contentItem.duration : mediaRef?.current ? duration : interval);
    const [startTime, setStartTime] = useState(contentItem.start_time ? contentItem.start_time : 0);

    const timelineRef = useRef(null);
    const currentHandleRef = useRef(null);

    const calculateTimelineClick = useCallback((e) => {
        if (!timelineRef?.current)
            return;
        const rect = timelineRef.current.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const position = (clientX - rect.left) / rect.width;
        const newTime = Math.min(Math.max(position * duration, 0), duration);
        return newTime;
    }, [timelineRef, duration]);

    useEffect(() => {
        setEndTime(contentItem.duration ? contentItem.start_time + contentItem.duration : mediaRef?.current ? duration : interval);
    }, [duration]);

    useEffect(() => {
        if (!mediaRef?.current)
            return;
        if (mediaRef.current.player) {
            mediaRef.current.player.currentTime(startTime);
        } else {
            mediaRef.current.currentTime = startTime;
        }
        setCurrentTime(startTime);
    }, [startTime]);

    useEffect(() => {
        if (!mediaRef?.current)
            return;

        const updateDuration = async () => {
            if (!mediaRef?.current)
                return;
            if (mediaRef.current.player) {
                setDuration(mediaRef.current.player.duration());
            } else if (mediaRef.current.readyState >= 1) {
                let audioDuration = mediaRef.current.duration;
                
                if (mediaRef.current.src.toLowerCase().endsWith('.mp3') && 
                    (!isFinite(audioDuration) || audioDuration <= 0)) {
                    try {
                        const file = await fetch(mediaRef.current.src).then(r => r.blob());
                        audioDuration = await getAudioDurationFromFile(file);
                    } catch (error) {
                        console.error('Error getting audio duration:', error);
                    }
                }
    
                setDuration(audioDuration);
            }
        };

        const handleLoadedMetadata = () => {
            updateDuration();
        };

        if (mediaRef.current?.player) {
            mediaRef.current.player.ready(function() {
                this.on('loadedmetadata', handleLoadedMetadata);
                this.on('timeupdate', updateTime);
            });
        } else if (typeof mediaRef.current.addEventListener === 'function') {
            mediaRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        }
    
        // Initial call in case the metadata is already loaded
        updateDuration();
    
        return () => {
            if (mediaRef?.current) {
                if (mediaRef.current.player) {
                    mediaRef.current.player.off('loadedmetadata', handleLoadedMetadata);
                    mediaRef.current.player.off('timeupdate', updateTime);
                } else if (typeof mediaRef.current.removeEventListener === 'function') {
                    mediaRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                }
            }
        };
    }, [mediaRef]);

    const updateTime = useCallback(() => {
        if (!mediaRef?.current) return;
        let currentTime;
        if (mediaRef.current?.player) {
            currentTime = mediaRef.current.player.currentTime();
        } else if (mediaRef.current.readyState >= 2) {
            currentTime = mediaRef.current.currentTime;
        } else {
            return;
        }

        if (currentTime >= endTime) {
            pause();
            if (mediaRef.current?.player) {
                mediaRef.current.player.currentTime(startTime);
            } else {
                mediaRef.current.currentTime = startTime;
            }
            setCurrentTime(startTime);
        } else {
            setCurrentTime(currentTime);
        }
    }, [mediaRef, startTime, endTime, pause]);

    useEffect(() => {
        if (!mediaRef?.current) return;
        
        const handlePlay = () => {
            if (!mediaRef?.current) return;

            if (mediaRef.current?.player) {
                if (mediaRef.current.player.currentTime() < startTime) {
                    mediaRef.current.player.currentTime(startTime);
                    setCurrentTime(startTime);
                }
                mediaRef.current.player.on('timeupdate', updateTime);
            } else {
                if (mediaRef.current.currentTime < startTime) {
                    mediaRef.current.currentTime = startTime;
                    setCurrentTime(startTime);
                }
                mediaRef.current.addEventListener('timeupdate', updateTime);
            }
        };
    
        const handlePause = () => {
            if (mediaRef.current?.player) {
                mediaRef.current.player.off('timeupdate', updateTime);
            } else if (typeof mediaRef.current.removeEventListener === 'function') {
                mediaRef.current.removeEventListener('timeupdate', updateTime);
            }
        };
    
        if (mediaRef.current?.player) {
            mediaRef.current.player.on('play', handlePlay);
            mediaRef.current.player.on('pause', handlePause);
        } else {
            if (typeof mediaRef.current.addEventListener === 'function') {
                mediaRef.current.addEventListener('play', handlePlay);
                mediaRef.current.addEventListener('pause', handlePause);
            }
        }
    
        // Initial setup
        if (mediaRef.current.player) {
            if (!mediaRef.current.player.paused()) {
                mediaRef.current.player.on('timeupdate', updateTime);
            }
        } else if (!mediaRef.current.paused && typeof mediaRef.current.addEventListener === 'function') {
            mediaRef.current.addEventListener('timeupdate', updateTime);
        }
    
        return () => {
            if (!mediaRef.current) return;
            if (mediaRef.current.player) {
                mediaRef.current.player.off('play', handlePlay);
                mediaRef.current.player.off('pause', handlePause);
                mediaRef.current.player.off('timeupdate', updateTime);
            } else if (typeof mediaRef.current.removeEventListener === 'function') {
                mediaRef.current.removeEventListener('play', handlePlay);
                mediaRef.current.removeEventListener('pause', handlePause);
                mediaRef.current.removeEventListener('timeupdate', updateTime);
            }
        };
    }, [mediaRef, updateTime]);


    const handleDrag = useCallback((e) => {
        const clientX = e.clientX || e.touches[0].clientX;
        const newTime = calculateTimelineClick({ clientX });
        if (currentHandleRef.current === 'start') {
            if (!mediaRef?.current)
                return;
            const newStartTime = Math.min(newTime, endTime - 1.0);
            setStartTime(newStartTime);
            contentItem.start_time = newStartTime;
            contentItem.duration = endTime - newStartTime;
        } else if (currentHandleRef.current === 'end') {
            const newEndTime = Math.max(newTime, startTime + 1.0);
            if (!startTime)
                setStartTime(0);
            setEndTime(newEndTime);
            if (mediaRef?.current)
            {
                pause();
                mediaRef.current.currentTime = newEndTime;
                setCurrentTime(newEndTime);
            }
            contentItem.duration = newEndTime - contentItem.start_time;
        }
    }, [startTime, endTime, mediaRef]);

    const handleMouseDown = useCallback((handle) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentHandleRef.current = handle;

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleMouseUp);
    }, [handleDrag]);

    const handleMouseUp = useCallback(() => {
        currentHandleRef.current = null;
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [handleDrag]);

    const handleTouchStart = useCallback((handle) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentHandleRef.current = handle;

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
    }, []);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleDrag({ clientX: touch.clientX });
    }, [handleDrag]);

    const handleTouchEnd = useCallback(() => {
        currentHandleRef.current = null;
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    }, [handleTouchMove]);

    const handleTimelineClick = useCallback((e) => {
        if (currentHandleRef.current || !timelineRef.current || !mediaRef?.current) return;
        
        if (e.target.closest('.timeline-handle')) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clickPosition = (clientX - rect.left) / rect.width;
        const clickTime = clickPosition * duration;

        if (clickTime >= startTime && clickTime <= endTime) 
        {
            mediaRef.current.currentTime = clickTime;
            setCurrentTime(clickTime);
        }
    }, [startTime, endTime, duration, mediaRef]);


    const styles = useMemo(() => ({
        timelineStyle: {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: privateID || jwt ? '15px' : '10px',
            backgroundColor: privateID || jwt ? '#ddd' : 'transparent',
            bottom: privateID || jwt ? '20px' : '0px',
            overflow: 'visible',
            cursor: 'pointer',
            zIndex: 1000,
            pointerEvents: 'auto',
            display: hidden ? 'none' : 'block',
            ...props.style
        },
        currWindowStyle: {
            position: 'absolute',
            left: `${(startTime / duration) * 100}%`,
            width: `${((endTime - startTime) / duration) * 100}%`,
            height: '100%',
            backgroundColor: privateID || jwt ? '#999' : 'rgba(100, 100, 100, 0.2)'
        },
        handleStyle: {
            position: 'absolute',
            width: '20px',
            height: '100%',
            backgroundColor: '#666',
            cursor: 'ew-resize',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        currTimeStyle: {
            position: 'absolute',
            left: `${(currentTime / duration) * 100}%`,
            width: '2px',
            height: '100%',
            backgroundColor: privateID || jwt ? 'red' : 'rgba(255, 0, 0, 0.6)',
            pointerEvents: 'none'
        },
        timeIndicatorStyle: {
            position: 'absolute',
            bottom: '-20px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white',
            whiteSpace: 'nowrap',
        }
    }), [startTime, endTime, currentTime, duration, props.style]);
    
    return (
        <div 
            ref={timelineRef}
            onClick={handleTimelineClick}
            onTouchStart={handleTimelineClick}
            style={styles.timelineStyle}
            key={duration}
            className="hide-on-inactive"
        >
            <div style={styles.currWindowStyle} />
            {(privateID || jwt) && <div
                className="timeline-handle"
                onMouseDown={handleMouseDown('start')}
                onTouchStart={handleTouchStart('start')}
                style={{...styles.handleStyle, left: `${(startTime / duration) * 100}%`}}
            >
                <FaGripLinesVertical color="white" size={12} />
                <span style={{ ...styles.timeIndicatorStyle, left: '50%', transform: 'translateX(-50%)' }}>
                    {formatTime(startTime)}
                </span>
            </div>}
            {(privateID || jwt) && <div
                className="timeline-handle"
                onMouseDown={handleMouseDown('end')}
                onTouchStart={handleTouchStart('end')}
                style={{...styles.handleStyle, left: `calc(${(endTime / duration) * 100}% - 20px)`}}
            >
                <FaGripLinesVertical color="white" size={12} />
                <span style={{ ...styles.timeIndicatorStyle, left: '50%', transform: 'translateX(-50%)' }}>
                    {formatTime(endTime)}
                </span>
            </div>}
            {mediaRef?.current?.youtube ? "" : <div style={styles.currTimeStyle} />}
        </div>
    );
}