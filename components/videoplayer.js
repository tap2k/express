// components/videoplayer.js

import { useRef } from "react";
import useMediaControl from "../hooks/usemediacontrol";
import PlayIcon from './playicon';

export default function VideoPlayer({ width, height, controls, autoPlay, index, children }) 
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
        controls={controls}
      >
        {children}
      </video>
      <PlayIcon isPlaying={isPlaying} toggle={toggle} inverted={false} />
    </div>
  );
}
