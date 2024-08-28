import { useState, useEffect, useRef } from 'react';
import { FaGripLinesVertical } from 'react-icons/fa';

export default function Timeline ({ contentItem, mediaRef, isPlaying, pause, privateID }) {
    const [startTime, setStartTime] = useState(contentItem.start_time ? contentItem.start_time : 0);
    const [duration, setDuration] = useState(0);
    const [endTime, setEndTime] = useState(contentItem.start_time + contentItem.duration);
    const [currentTime, setCurrentTime] = useState(contentItem.start_time);
    const timelineRef = useRef(null);
    const currentHandleRef = useRef(null);

    useEffect(() => {
        if (mediaRef.current) {
          mediaRef.current.currentTime = startTime;
        }
      }, []); 

    useEffect(() => {
        setEndTime(contentItem.duration ? contentItem.start_time + contentItem.duration : duration);
    }, [duration]);

    useEffect(() => {
        // Only update if different
        if ((endTime - startTime) < (duration - 0.1))
        {
            contentItem.start_time = startTime;
            contentItem.duration = endTime - startTime;
        }
    }, [startTime, endTime]);

    useEffect(() => {
        if (!mediaRef.current)
            return;

        const updateDuration = () => {
            if (mediaRef.current.readyState >= 1) {
                setDuration(mediaRef.current.duration);
            }
        };
        mediaRef.current.addEventListener('loadedmetadata', updateDuration);

        // Check if duration is already available
        if (mediaRef.current.readyState >= 1)
            updateDuration();

        return () => {
            if (mediaRef.current)
                mediaRef.current.removeEventListener('loadedmetadata', updateDuration);
        };
    }, [mediaRef]);

    useEffect(() => {
        if (!mediaRef.current)
            return;

        const updateTime = () => {
            setCurrentTime(mediaRef.current?.currentTime);
            if (mediaRef.current.currentTime >= endTime) {
                pause();
                mediaRef.current.currentTime = endTime;
            }
        };
        mediaRef.current.addEventListener('timeupdate', updateTime);

        return () => 
            {
                if (mediaRef.current)
                    mediaRef.current.removeEventListener('timeupdate', updateTime);
            }
    }, [mediaRef, endTime]);

    useEffect(() => {
        if (!mediaRef.current)
            return;

        if (isPlaying && mediaRef.current.currentTime >= endTime - 0.1)
            mediaRef.current.currentTime = startTime;
    }, [isPlaying]);

    const handleDrag = (e) => {
        if (!mediaRef.current)
            return;

        const rect = timelineRef.current.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        const newTime = Math.min(Math.max(position * duration, 0), duration);

        if (currentHandleRef.current === 'start') {
            const newStartTime = Math.min(newTime, endTime - 0.1);
            setStartTime(newStartTime);
            mediaRef.current.currentTime = newStartTime;
        } else if (currentHandleRef.current === 'end') {
            const newEndTime = Math.max(newTime, startTime + 0.1);
            setEndTime(newEndTime);
            if (!startTime)
                setStartTime(0);
            mediaRef.current.currentTime = newEndTime;
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

    const handleTimelineClick = (e) => {
        if (currentHandleRef.current || !timelineRef.current || !mediaRef.current) return;
        
        if (e.target.closest('.timeline-handle')) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
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
        bottom: '0px',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: 99999,  
        pointerEvents: 'auto'
    }

    const currWindowStyle = {
        position: 'absolute',
        left: `${(startTime / duration) * 100}%`,
        width: `${((endTime - startTime) / duration) * 100}%`,
        height: '100%',
        backgroundColor: '#999'
    }

    const handleStyle = {
        position: 'absolute',
        width: '20px',
        height: '100%',
        backgroundColor: '#666',
        cursor: 'ew-resize',
        borderRadius: '5px 0 0 5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }

    const currTimeStyle = {
        position: 'absolute',
        left: `${(currentTime / duration) * 100}%`,
        width: '2px',
        height: '100%',
        backgroundColor: 'red',
        pointerEvents: 'none'
    }
    
  return (
    privateID && <div 
      ref={timelineRef}
      onClick={handleTimelineClick}
      style={timelineStyle}
    >
      <div style={currWindowStyle} />
      <div
        className="timeline-handle"
        onMouseDown={handleMouseDown('start')}
        style={{...handleStyle, left: `calc(${(startTime / duration) * 100}%)`}}
      >
        <FaGripLinesVertical color="white" size={12} />
      </div>
      <div
        className="timeline-handle"
        onMouseDown={handleMouseDown('end')}
        style={{...handleStyle, left: `calc(${(endTime / duration) * 100}% - 20px)`}}
      >
        <FaGripLinesVertical color="white" size={12} />
      </div>
      <div
        style={currTimeStyle}
      />
    </div>
  );
};