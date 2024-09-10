import { useState, useEffect, useRef } from 'react';
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

export default function Timeline({ contentItem, mediaRef, interval, isPlaying, pause, duration, setDuration, privateID, jwt }) {
    const [startTime, setStartTime] = useState(contentItem.start_time ? contentItem.start_time : 0);
    const [endTime, setEndTime] = useState(contentItem.duration ? contentItem.start_time + contentItem.duration : mediaRef?.current ? duration : interval);
    const [currentTime, setCurrentTime] = useState(contentItem.start_time);
    const timelineRef = useRef(null);
    const currentHandleRef = useRef(null);

    const calculateTimelineClick = (e) => {
        if (!timelineRef?.current)
            return;
        const rect = timelineRef.current.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const position = (clientX - rect.left) / rect.width;
        const newTime = Math.min(Math.max(position * duration, 0), duration);
        return newTime;
    }        

    useEffect(() => {
        //if (mediaRef?.current) 
        //    mediaRef.current.currentTime = startTime;
        setEndTime(contentItem.duration ? contentItem.start_time + contentItem.duration : mediaRef?.current ? duration : interval);
    }, [duration]);

    useEffect(() => {
        if (!mediaRef?.current || mediaRef.current.youtube)
          return;
    
        const updateDuration = async () => {
          if (mediaRef.current.readyState >= 1) {
            let audioDuration = mediaRef.current.duration;
            
            // Check if it's an MP3 file and duration is not available
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
          if (isFinite(mediaRef.current.duration) && mediaRef.current.duration > 0) {
            setDuration(mediaRef.current.duration);
          } else {
            updateDuration();
          }
        };
    
        if (mediaRef.current.addEventListener)
            mediaRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    
        // Check if duration is already available
        if (mediaRef.current.readyState >= 1) {
          handleLoadedMetadata();
        }
    
        return () => {
          if (mediaRef?.current && mediaRef.current.removeEventListener)
            mediaRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
      }, [mediaRef]);
      
    useEffect(() => {
        if (!mediaRef?.current || mediaRef.current.youtube)
            return;

        const updateTime = () => {
            if (!mediaRef?.current)
                return;
            setCurrentTime(mediaRef.current.currentTime);
            if (mediaRef.current.currentTime >= endTime) {
                pause();
                mediaRef.current.currentTime = endTime;
            }
        };

        if (mediaRef.current.addEventListener)
            mediaRef.current.addEventListener('timeupdate', updateTime);

        return () => {
            if (mediaRef?.current && mediaRef.current.removeEventListener)
                mediaRef.current.removeEventListener('timeupdate', updateTime);
        }
    }, [mediaRef, endTime]);

    useEffect(() => {
        if (!mediaRef?.current)
            return;
        if (isPlaying && mediaRef.current.currentTime >= endTime - 0.1)
            mediaRef.current.currentTime = startTime;
    }, [isPlaying]);

    const handleDrag = (e) => {
        const clientX = e.clientX || e.touches[0].clientX;
        const newTime = calculateTimelineClick({ clientX });
        if (currentHandleRef.current === 'start') {
            if (!mediaRef?.current)
                return;
            const newStartTime = Math.min(newTime, endTime - 1.0);
            setStartTime(newStartTime);
            mediaRef.current.currentTime = newStartTime;
            contentItem.start_time = newStartTime;
            contentItem.duration = endTime - newStartTime;
        } else if (currentHandleRef.current === 'end') {
            const newEndTime = Math.max(newTime, startTime + 1.0);
            if (!startTime)
                setStartTime(0);
            setEndTime(newEndTime);
            if (mediaRef?.current)
                mediaRef.current.currentTime = newEndTime;
            contentItem.duration = newEndTime - startTime;
        }
    };

    const handleMouseDown = (handle) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentHandleRef.current = handle;

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseUp = () => {
        currentHandleRef.current = null;
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (handle) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentHandleRef.current = handle;

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleDrag({ clientX: touch.clientX });
    };

    const handleTouchEnd = () => {
        currentHandleRef.current = null;
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleTimelineClick = (e) => {
        if (currentHandleRef.current || !timelineRef.current || !mediaRef?.current) return;
        
        if (e.target.closest('.timeline-handle')) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clickPosition = (clientX - rect.left) / rect.width;
        const clickTime = clickPosition * duration;

        if (clickTime >= startTime && clickTime <= endTime) 
            mediaRef.current.currentTime = clickTime;
    }

    const timelineStyle = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '20px',
        backgroundColor: '#ddd',
        bottom: '20px', // Changed from 0px to accommodate time indicators
        overflow: 'visible', // Changed from 'hidden' to show time indicators
        cursor: 'pointer',
        zIndex: 10,  
        pointerEvents: 'auto',
    };
    
    const currWindowStyle = {
        position: 'absolute',
        left: `${(startTime / duration) * 100}%`,
        width: `${((endTime - startTime) / duration) * 100}%`,
        height: '100%',
        backgroundColor: '#999'
    };
    
    const handleStyle = {
        position: 'absolute',
        width: '20px',
        height: '100%',
        backgroundColor: '#666',
        cursor: 'ew-resize',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };
    
    const currTimeStyle = {
        position: 'absolute',
        left: `${(currentTime / duration) * 100}%`,
        width: '2px',
        height: '100%',
        backgroundColor: 'red',
        pointerEvents: 'none'
    };
    
    const timeIndicatorStyle = {
        position: 'absolute',
        bottom: '-20px', // Position below the timeline
        fontSize: '12px',
        fontWeight: 'bold',
        color: 'white',
        whiteSpace: 'nowrap',
    };
    
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    return (
            <div 
                ref={timelineRef}
                onClick={handleTimelineClick}
                onTouchStart={handleTimelineClick}
                style={timelineStyle}
            >
                <div style={currWindowStyle} />
                {(privateID || jwt) && <div
                    className="timeline-handle"
                    onMouseDown={handleMouseDown('start')}
                    onTouchStart={handleTouchStart('start')}
                    style={{...handleStyle, left: `${(startTime / duration) * 100}%`}}
                >
                    <FaGripLinesVertical color="white" size={12} />
                    <span style={{ ...timeIndicatorStyle, left: '50%', transform: 'translateX(-50%)' }}>
                        {formatTime(startTime)}
                    </span>
                </div>}
                {(privateID || jwt) && <div
                    className="timeline-handle"
                    onMouseDown={handleMouseDown('end')}
                    onTouchStart={handleTouchStart('end')}
                    style={{...handleStyle, left: `calc(${(endTime / duration) * 100}% - 20px)`}}
                >
                    <FaGripLinesVertical color="white" size={12} />
                    <span style={{ ...timeIndicatorStyle, left: '50%', transform: 'translateX(-50%)' }}>
                        {formatTime(endTime)}
                    </span>
                </div>}
                {mediaRef?.current?.youtube ? "" : <div style={currTimeStyle} />}
            </div>
    );
}