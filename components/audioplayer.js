// components/audioplayer.js

import { useRef } from "react";
import useMediaControl from "../hooks/usemediacontrol";
import getMediaURL from "../hooks/getmediaurl";
import Caption from './caption';
import PlayIcon from './playicon';
import FullImage from './fullimage';

export default function AudioPlayer({ src, thumbnailItem, caption, width, height, autoPlay, index }) 
{
  const audioRef = useRef();
  const { isPlaying, toggle } = useMediaControl(audioRef, index, autoPlay);

  let thumbnailUrl = "";
  if (thumbnailItem?.url) {
    thumbnailUrl = getMediaURL() + thumbnailItem.url;
  }

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
      {thumbnailUrl ? (
        <FullImage 
          src={thumbnailUrl} 
          width={width} 
          height={height} 
          caption={caption}
          inverted={false}
        />
      ) : (
        <Caption caption={caption} inverted={true} />
      )}
      {!isPlaying && <PlayIcon inverted={!thumbnailUrl} />}
      <audio src={src} style={{display: "none"}} ref={audioRef} />
    </div>
  );
}
