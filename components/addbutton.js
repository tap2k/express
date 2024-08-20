import { useState, useRef } from 'react';
import Link from 'next/link';
import { FaPlay, FaPause, FaPlus } from 'react-icons/fa';
import getMediaURL from "../hooks/getmediaurl";

export default function AddButton({ channel }) {
  if (!channel)
    return;

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
      if (isPlaying) {
          audioRef.current.pause();
      } else {
          audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
  };

  const buttonStyle = {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'rgba(92, 131, 156, 0.6)',
      color: 'rgba(240, 240, 240, 1)',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
  };

  const containerStyle = {
      position: 'fixed',
      bottom: '15px',
      right: '10px',
      display: 'flex',
      gap: '10px',
      zIndex: 1000,
  };

  const buttonHoverEffect = (e) => {
      e.target.style.backgroundColor = 'rgba(92, 131, 156, 0.8)';
      e.target.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.15)';
      e.target.style.transform = 'translateY(-1px) scale(1.03)';
  };

  const buttonLeaveEffect = (e) => {
      e.target.style.backgroundColor = 'rgba(92, 131, 156, 0.6)';
      e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
      e.target.style.transform = 'translateY(0) scale(1)';
  };

  return (
      <div style={containerStyle}>
          {channel.audiofile?.url && (
              <>
                  <audio ref={audioRef} src={getMediaURL() + channel.audiofile.url} />
                  <button 
                      onClick={togglePlayPause}
                      style={buttonStyle}
                      onMouseEnter={buttonHoverEffect}
                      onMouseLeave={buttonLeaveEffect}
                  >
                      {isPlaying ? (
                          <FaPause color="rgba(240, 240, 240, 1)" />
                      ) : (
                          <FaPlay color="rgba(240, 240, 240, 1)" />
                      )}
                  </button>
              </>
          )}
          <Link 
              href={`/upload?channelid=${channel.uniqueID}`}
              rel="noopener noreferrer" 
              target="_blank"
              style={buttonStyle}
              onMouseEnter={buttonHoverEffect}
              onMouseLeave={buttonLeaveEffect}
          >
              <FaPlus color="rgba(240, 240, 240, 1)" />
          </Link>
      </div>
  );
}
