import { useState, useEffect, useRef } from 'react';
import { FaGripLinesVertical } from 'react-icons/fa';

export default function Timeline({ contentItem, mediaRef, interval, isPlaying, pause, duration, setDuration, privateID, jwt }) {
    const [startTime, setStartTime] = useState(contentItem.start_time ? contentItem.start_time : 0);
    const [endTime, setEndTime] = useState(contentItem.duration ? contentItem.start_time + contentItem.duration : interval ?(interval / 1000.0) : duration);
    const [currentTime, setCurrentTime] = useState(contentItem.start_time);
    const timelineRef = useRef(null);
    const currentHandleRef = useRef(null);

    const calculateTimelineClick = (e) => {
        if (!timelineRef?.current)
            return;
        const rect = timelineRef.current.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        const newTime = Math.min(Math.max(position * duration, 0), duration);
        return newTime;
    }        

    useEffect(() => {
        if (mediaRef?.current) {
            if (mediaRef.current.youtube)
                mediaRef.current.seekTo(startTime);
            else
                mediaRef.current.currentTime = startTime;
        }
        setEndTime(contentItem.duration ? contentItem.start_time + contentItem.duration : duration);
    }, [duration]);

    useEffect(() => {
        if (!mediaRef?.current || mediaRef.current.youtube)
            return;

        const updateDuration = () => {
            if (mediaRef.current.readyState >= 1) {
                setDuration(mediaRef?.current?.duration);
            }
        };

        mediaRef.current.addEventListener('loadedmetadata', updateDuration);

        // Check if duration is already available
        if (mediaRef.current.readyState >= 1)
            updateDuration();

        return () => {
            if (mediaRef?.current)
                mediaRef.current.removeEventListener('loadedmetadata', updateDuration);
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

        mediaRef.current.addEventListener('timeupdate', updateTime);

        return () => {
            if (mediaRef?.current)
                mediaRef.current.removeEventListener('timeupdate', updateTime);
        }
    }, [mediaRef, endTime]);

    useEffect(() => {
        if (!mediaRef?.current)
            return;
        const currTime = mediaRef.current.youtube ? mediaRef.current.getCurrentTime() : mediaRef.current.currentTime;
        if (isPlaying && currTime >= endTime - 0.1)
        {
            if (mediaRef.current.youtube)
                mediaRef.current.seekTo(startTime)
            else
                mediaRef.current.currentTime = startTime;
        }
    }, [isPlaying]);



    useEffect(() => {
        if (startTime >= 0 && endTime > 0.2) {
            contentItem.start_time = startTime;
            contentItem.duration = endTime - startTime;
        }
    }, [startTime, endTime]);

    const handleDrag = (e) => {
        const newTime = calculateTimelineClick(e);
        if (currentHandleRef.current === 'start') {
            if (!mediaRef?.current)
                return;
            const newStartTime = Math.min(newTime, endTime - 1.0);
            setStartTime(newStartTime);
            if (mediaRef.current.youtube)
                mediaRef.current.seekTo(newStartTime)
            else
                mediaRef.current.currentTime = newStartTime;
        } else if (currentHandleRef.current === 'end') {
            const newEndTime = Math.max(newTime, startTime + 1.0);
            if (!startTime)
                setStartTime(0);
            setEndTime(newEndTime);
            if (mediaRef?.current)
            {
                if (mediaRef.current.youtube)
                    mediaRef.current.seekTo(newEndTime)
                else
                    mediaRef.current.currentTime = newEndTime;
            }
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
        if (currentHandleRef.current || !timelineRef.current || !mediaRef?.current) return;
        
        if (e.target.closest('.timeline-handle')) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        const clickTime = clickPosition * duration;

        if (clickTime >= startTime && clickTime <= endTime) 
            if (mediaRef.current.youtube)
                mediaRef.current.seekTo(clickTime)
            else
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
        borderRadius: '10px',
        overflow: 'visible', // Changed from 'hidden' to show time indicators
        cursor: 'pointer',
        zIndex: 99999,  
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
        (privateID || jwt) && (
            <div 
                ref={timelineRef}
                onClick={handleTimelineClick}
                style={timelineStyle}
            >
                <div style={currWindowStyle} />
                <div
                    className="timeline-handle"
                    onMouseDown={handleMouseDown('start')}
                    style={{...handleStyle, left: `${(startTime / duration) * 100}%`}}
                >
                    <FaGripLinesVertical color="white" size={12} />
                    <span style={{ ...timeIndicatorStyle, left: '50%', transform: 'translateX(-50%)' }}>
                        {formatTime(startTime)}
                    </span>
                </div>
                <div
                    className="timeline-handle"
                    onMouseDown={handleMouseDown('end')}
                    style={{...handleStyle, left: `calc(${(endTime / duration) * 100}% - 20px)`}}
                >
                    <FaGripLinesVertical color="white" size={12} />
                    <span style={{ ...timeIndicatorStyle, left: '50%', transform: 'translateX(-50%)' }}>
                        {formatTime(endTime)}
                    </span>
                </div>
                {mediaRef?.current?.youtube ? "" : <div style={currTimeStyle} />}
            </div>
        )
    );
}