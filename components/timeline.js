import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
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

export function Timeline({ contentItem, mediaRef, player, interval, pause, duration, setDuration, privateID, jwt, ...props }) {
    const currentTimeRef = useRef(0.0);
    const startTimeRef = useRef(contentItem.start_time || 0);
    const endTimeRef = useRef(contentItem.duration || duration || 5.0);
    const [, forceUpdate] = useState({});

    const timelineRef = useRef(null);
    const currentHandleRef = useRef(null);

    useEffect(() => {
        if (contentItem.duration) {
            endTimeRef.current = contentItem.duration;
        } else if (duration && endTimeRef.current !== duration) {
            endTimeRef.current = duration;
        }
        forceUpdate({});
    }, [duration, mediaRef, player]);

    useEffect(() => {
        if (!mediaRef?.current) return;
        if (player) {
            player.currentTime(startTimeRef.current);
        } else {
            mediaRef.current.currentTime = startTimeRef.current;
        }
        currentTimeRef.current = startTimeRef.current;
        forceUpdate({});
    }, [mediaRef, player]);

    useEffect(() => {

        const updateDuration = async () => {

            let audioDuration = player ? player.duration() : mediaRef.current?.duration;            
            const src = player ? player.currentSrc() : mediaRef.current?.src;

            if (src && src.toLowerCase().endsWith('.mp3') && (audioDuration === Infinity || audioDuration === NaN)) {
                console.error("No audio duration found for: " + src);
                try {
                    const file = await fetch(src).then(r => r.blob());
                    audioDuration = await getAudioDurationFromFile(file);
                } catch (error) {
                    console.error('Error getting audio duration:', error);
                }
            }

            if (audioDuration && !isNaN(audioDuration) && audioDuration !== Infinity) 
                setDuration(audioDuration);
            else
            {
                setDuration(20.0);
                if (!contentItem.duration)
                    endTimeRef.current = 5.0;
            }
        }

        const handleLoadedMetadata = () => {
            updateDuration();
        };

        if (player) {
            player.ready(function() {
                this.on('loadedmetadata', handleLoadedMetadata);
                this.on('timeupdate', updateTime);
            });
        } else if (mediaRef.current && typeof mediaRef.current.addEventListener === 'function') {
            mediaRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        }
    
        updateDuration();
    
        return () => {
            if (mediaRef?.current) {
                if (player) {
                    player.off('loadedmetadata', handleLoadedMetadata);
                    player.off('timeupdate', updateTime);
                } else if (mediaRef.current && typeof mediaRef.current.removeEventListener === 'function') {
                    mediaRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                }
            }
        };
    }, [mediaRef, player]);

    const updateTime = useCallback(() => {
        console.log("current Time = " + mediaRef.current.currentTime);
        console.log("end time = " + endTimeRef.current);
        if (!mediaRef?.current && !player) return;
        let newCurrentTime;
        if (player) {
            newCurrentTime = player.currentTime();
        } else if (mediaRef.current.readyState >= 2) {
            newCurrentTime = mediaRef.current.currentTime;
        } else {
            return;
        }

        if (newCurrentTime >= endTimeRef.current) {
            pause();
            if (player) {
                player.currentTime(startTimeRef.current);
            } else {
                mediaRef.current.currentTime = startTimeRef.current;
            }
            currentTimeRef.current = startTimeRef.current;
        } else {
            currentTimeRef.current = newCurrentTime;
        }
        forceUpdate({});
    }, [mediaRef, player, pause]);

    useEffect(() => {
        if (!mediaRef?.current && !player) return;
        
        const handlePlay = () => {
            if (!mediaRef?.current && !player) return;

            if (player) {
                if (player.currentTime() < startTimeRef.current) {
                    player.currentTime(startTimeRef.current);
                    currentTimeRef.current = startTimeRef.current;
                }
                player.on('timeupdate', updateTime);
            } else {
                if (mediaRef.current.currentTime < startTimeRef.current) {
                    mediaRef.current.currentTime = startTimeRef.current;
                    currentTimeRef.current = startTimeRef.current;
                }
                mediaRef.current.addEventListener('timeupdate', updateTime);
            }
            forceUpdate({});
        };
    
        const handlePause = () => {
            if (player) {
                player.off('timeupdate', updateTime);
            } else if (mediaRef.current && typeof mediaRef.current.removeEventListener === 'function') {
                mediaRef.current.removeEventListener('timeupdate', updateTime);
            }
        };
    
        if (player) {
            player.on('play', handlePlay);
            player.on('pause', handlePause);
        } else {
            if (mediaRef.current && typeof mediaRef.current.addEventListener === 'function') {
                mediaRef.current.addEventListener('play', handlePlay);
                mediaRef.current.addEventListener('pause', handlePause);
            }
        }
    
        // Initial setup
        if (player) {
            if (!player.paused()) {
                player.on('timeupdate', updateTime);
            }
        } else if (mediaRef.current && !mediaRef.current.paused && typeof mediaRef.current.addEventListener === 'function') {
            mediaRef.current.addEventListener('timeupdate', updateTime);
        }
    
        return () => {
            if (!mediaRef.current) return;
            if (player) {
                player.off('play', handlePlay);
                player.off('pause', handlePause);
                player.off('timeupdate', updateTime);
            } else if (mediaRef.current && typeof mediaRef.current.removeEventListener === 'function') {
                mediaRef.current.removeEventListener('play', handlePlay);
                mediaRef.current.removeEventListener('pause', handlePause);
                mediaRef.current.removeEventListener('timeupdate', updateTime);
            }
        };
    }, [mediaRef, player]);

    const calculateTimelineClick = useCallback((e) => {
        if (!timelineRef?.current)
            return;
        const rect = timelineRef.current.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const position = (clientX - rect.left) / rect.width;
        const newTime = Math.min(Math.max(position * duration, 0), duration);
        return newTime;
    }, [timelineRef, duration]);

    const handleDrag = useCallback((e) => {
        const clientX = e.clientX || e.touches[0].clientX;
        const newTime = calculateTimelineClick({ clientX });
        if (currentHandleRef.current === 'start') {
            if (!mediaRef?.current) return;
            const newStartTime = Math.min(newTime, endTimeRef.current - 1.0);
            startTimeRef.current = newStartTime;
            contentItem.start_time = newStartTime;
            contentItem.duration = endTimeRef.current - newStartTime;
        } else if (currentHandleRef.current === 'end') {
            const newEndTime = Math.max(newTime, startTimeRef.current + 1.0);
            //if (!startTimeRef.current) startTimeRef.current = 0;
            endTimeRef.current = newEndTime;
            if (mediaRef?.current) {
                pause();
                mediaRef.current.currentTime = newEndTime;
                currentTimeRef.current = newEndTime;
            }
            contentItem.duration = newEndTime - contentItem.start_time;
        }
        forceUpdate({});
    }, [calculateTimelineClick, mediaRef, pause, contentItem]);

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

        if (clickTime >= startTimeRef.current && clickTime <= endTimeRef.current) {
            mediaRef.current.currentTime = clickTime;
            currentTimeRef.current = clickTime;
            forceUpdate({});
        }
    }, [duration, mediaRef]);


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
            ...props.style
        },
        currWindowStyle: {
            position: 'absolute',
            left: `${(startTimeRef.current / duration) * 100}%`,
            width: `${((endTimeRef.current - startTimeRef.current) / duration) * 100}%`,
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
            left: `${(currentTimeRef.current / duration) * 100}%`,
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
    }), [startTimeRef.current, endTimeRef.current, currentTimeRef.current, duration]);
    
    return (
        <div 
            ref={timelineRef}
            onClick={handleTimelineClick}
            onTouchStart={handleTimelineClick}
            style={styles.timelineStyle}
            key={duration}
            className="hide-on-inactive"
        >
            <div style={{
                ...styles.currWindowStyle,
                left: `${(startTimeRef.current / duration) * 100}%`,
                width: `${((endTimeRef.current - startTimeRef.current) / duration) * 100}%`,
            }} />
            {(privateID || jwt) && <div
                className="timeline-handle"
                onMouseDown={handleMouseDown('start')}
                onTouchStart={handleTouchStart('start')}
                style={{...styles.handleStyle, left: `${(startTimeRef.current / duration) * 100}%`}}
            >
                <FaGripLinesVertical color="white" size={12} />
                <span style={{ ...styles.timeIndicatorStyle, left: '50%', transform: 'translateX(-50%)' }}>
                    {formatTime(startTimeRef.current)}
                </span>
            </div>}
            {(privateID || jwt) && <div
                className="timeline-handle"
                onMouseDown={handleMouseDown('end')}
                onTouchStart={handleTouchStart('end')}
                style={{...styles.handleStyle, left: `calc(${(endTimeRef.current / duration) * 100}% - 20px)`}}
            >
                <FaGripLinesVertical color="white" size={12} />
                <span style={{ ...styles.timeIndicatorStyle, left: '50%', transform: 'translateX(-50%)' }}>
                    {formatTime(endTimeRef.current)}
                </span>
            </div>}
            {mediaRef?.current?.youtube ? "" : <div style={{
                ...styles.currTimeStyle,
                left: `${(currentTimeRef.current / duration) * 100}%`,
            }} />}
        </div>
    );
}

export default memo(Timeline);
