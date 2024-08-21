import { useState, useRef } from 'react';
import Link from 'next/link';
import { FaPlay, FaPause, FaPlus } from 'react-icons/fa';
import styled from 'styled-components';
import getMediaURL from "../hooks/getmediaurl";
import { MenuButton } from '../components/recorderstyles';

const CircularMenuButton = styled(MenuButton)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

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

  const containerStyle = {
      position: 'fixed',
      bottom: '25px',
      right: '10px',
      display: 'flex',
      zIndex: 1000,
  };

  return (
      <div style={containerStyle}>
          {channel.audiofile?.url && (
              <>
                  <audio ref={audioRef} src={getMediaURL() + channel.audiofile.url} />
                  <CircularMenuButton 
                      onClick={togglePlayPause}
                  >
                      {isPlaying ? (
                          <FaPause color="rgba(240, 240, 240, 1)" />
                      ) : (
                          <FaPlay color="rgba(240, 240, 240, 1)" />
                      )}
                  </CircularMenuButton>
              </>
          )}
        <CircularMenuButton 
            as={Link} 
            href={`/upload?channelid=${channel.uniqueID}`} 
            rel="noopener noreferrer" 
            target="_blank"
            style={{ right: '10px' }}
        >
            <FaPlus color="rgba(240, 240, 240, 1)" />
        </CircularMenuButton>
      </div>
  );
}
