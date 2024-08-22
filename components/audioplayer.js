import { useRef } from "react";
import useMediaControl from "../hooks/usemediacontrol";
import PlayIcon from './playicon';

export default function AudioPlayer({ src, width, height, controls, autoPlay, index }) 
{  
  const audioRef = useRef();
  const { isPlaying, toggle } = useMediaControl(audioRef, index, autoPlay);

  return (
    <div 
      style={{
        position: 'relative',
        width,
        height,
        cursor: 'pointer',
        minHeight: '150px',
        backgroundColor: 'black'
      }} 
    >
      <PlayIcon isPlaying={isPlaying} toggle={toggle} />
      <audio src={src} style={{display: "none"}} ref={audioRef} />
    </div>
  );
}
