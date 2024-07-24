// components/videoplayer.js

import { useRef } from "react";
import useMediaControl from "../hooks/usemediacontrol";
import PlayIcon from './playicon';
import Caption from './caption';

export default function VideoPlayer({ caption, width, height, autoPlay, index, children }) 
{
  const videoRef = useRef();
  const { isPlaying, toggle } = useMediaControl(videoRef, index, autoPlay);

  return (
    <div 
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#000',
        cursor: 'pointer'
      }} 
      onClick={toggle}
    >
      <video 
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        playsInline
        preload='metadata'
      >
        {children}
      </video>
      <Caption caption={caption} />
      {!isPlaying && <PlayIcon inverted={false} />}
    </div>
  );
}
