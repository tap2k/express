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
        mediaRef.current.currentTime = startTime;
        setCurrentTime(startTime);
    }, [startTime]);

    useEffect(() => {
        if (!mediaRef?.current || mediaRef.current.youtube)
            return;
    
        const updateDuration = async () => {
            if (mediaRef.current.readyState >= 1) {
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
    
        mediaRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        
        // Initial call in case the metadata is already loaded
        if (mediaRef.current.readyState >= 1) {
            updateDuration();
        }
    
        return () => {
            if (mediaRef?.current) {
                mediaRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, [mediaRef]);

    const updateTime = useCallback(() => {
        if (!mediaRef?.current || mediaRef.current.readyState < 2) return;
        if (mediaRef.current.currentTime >= endTime) {
            pause();
            mediaRef.current.currentTime = startTime;
            setCurrentTime(startTime);
        }
        else
            setCurrentTime(mediaRef.current.currentTime);
    }, [mediaRef, startTime, endTime]);

    useEffect(() => {
        if (!mediaRef?.current || mediaRef.current.youtube) return;
    
        const media = mediaRef.current;
    
        const handlePlay = () => {
            if (mediaRef.current.currentTime < startTime)
            {
                mediaRef.current.currentTime = startTime;
                setCurrentTime(startTime);
            }
            media.addEventListener('timeupdate', updateTime);
        };
    
        const handlePause = () => {
            media.removeEventListener('timeupdate', updateTime);
        };
    
        media.addEventListener('play', handlePlay);
        media.addEventListener('pause', handlePause);
    
        // Initial setup
        if (!media.paused) {
            media.addEventListener('timeupdate', updateTime);
        }
    
        return () => {
            media.removeEventListener('play', handlePlay);
            media.removeEventListener('pause', handlePause);
            media.removeEventListener('timeupdate', updateTime);
        };
    }, [mediaRef]);


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
                mediaRef.current.currentTime = newEndTime;
                setCurrentTime(clickTime);
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