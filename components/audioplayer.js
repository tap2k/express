// components/audioplayer.js

import { useRef } from "react";
import useMediaControl from "../hooks/usemediacontrol";
import PlayIcon from './playicon';
import FullImage from './fullimage';

export default function AudioPlayer({ src, thumbnailUrl, width, height, autoPlay, index }) 
{  
  const audioRef = useRef();
  const { isPlaying, toggle } = useMediaControl(audioRef, index, autoPlay);

  return (
    <div 
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: thumbnailUrl ? 'transparent' : '#000',
        cursor: 'pointer'
      }} 
      onClick={toggle}
    >
      <FullImage 
        src={thumbnailUrl} 
        width={width} 
        height={height} 
      />
      {!isPlaying && <PlayIcon inverted={!thumbnailUrl} />}
      <audio src={src} style={{display: "none"}} ref={audioRef} />
    </div>
  );
}
