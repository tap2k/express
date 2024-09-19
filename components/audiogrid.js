import { useState, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

export default function AudioGrid({ audioOptions, selectedAudio, setSelectedAudio }) {
    const audioRef = useRef();
    const [playingAudioIndex, setPlayingAudioIndex] = useState(null);

    const handleAudioToggle = (index) => {
        if (index === 0) {
          audioRef.current.pause();
          setPlayingAudioIndex(null);
          setSelectedAudio("None");
          return;
        }
    
        if (playingAudioIndex === index) {
          audioRef.current.pause();
          setPlayingAudioIndex(null);
        } else {
          audioRef.current.src = `audio/${audioOptions[index]}`;
          audioRef.current.play();
          setPlayingAudioIndex(index);
        }
        setSelectedAudio(audioOptions[index]);
      };

    const audioGridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(2, 1fr)`,
        //gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '5px',
        marginTop: '10px',
        width: '100%',
      };

  const audioItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#f8f9fa',
    height: '70px',
    border: '1px solid #ddd',
  };

  const audioNameStyle = {
    marginTop: '5px',
    textAlign: 'center',
    fontSize: 'small',
    wordBreak: 'break-word',
  };

  return ( 
    <div style={{...audioGridStyle, marginBottom: '5px'}}>
      {audioOptions.map((audio, index) => (
        <div 
          key={index} 
          style={{
            ...audioItemStyle,
            backgroundColor: selectedAudio === audio ? '#e6f2ff' : '#f8f9fa',
          }}
          onClick={() => handleAudioToggle(index)}
        >
          {audio === "None" ? (
            <span>None</span>
          ) : (
            <>
              {playingAudioIndex === index ? (
                <FaPause />
              ) : (
                <FaPlay />
              )}
              <span style={audioNameStyle}>{audio}</span>
            </>
          )}
        </div>
      ))}
      <audio ref={audioRef} style={{ display: 'none' }}>
        Your browser does not support the audio element.
      </audio>
    </div>
)}