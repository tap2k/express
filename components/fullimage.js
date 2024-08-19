import { useRef } from "react";
import useSlideAdvance from '../hooks/useslideadvance';
import useMediaControl from "../hooks/usemediacontrol";
import PlayIcon from './playicon';

export default function FullImage({ src, width, height, audioUrl, index, cover, controls, autoPlay, interval }) 
{
  const audioRef = useRef();
  const { isPlaying, toggle } = useMediaControl(audioRef, index, autoPlay);

  useSlideAdvance(
    index, 
    autoPlay && !audioUrl, 
    interval
  );
  
  return (
        <div 
          style={{
            position: 'relative',
            width,
            height,
            cursor: 'pointer'
          }} 
          onClick={toggle}
        >
       { src ? <img 
        src={src} 
        style={{
          width: '100%',
          height: '100%',
          objectFit: cover ? 'cover' : 'contain'
        }} 
      /> : "" }
      { audioUrl ? <>
          {!isPlaying && <PlayIcon />}
          <audio src={audioUrl} style={{display: "none"}} ref={audioRef} />
        </> : ""
      }
    </div>
  );
}
