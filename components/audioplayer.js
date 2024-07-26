// components/audioplayer.js

import { useRef } from "react";
import useMediaControl from "../hooks/usemediacontrol";
import getMediaURL from "../hooks/getmediaurl";
import PlayIcon from './playicon';
import FullImage from './fullimage';
import Caption from './caption';
import ProductLink from "./productlink";

export default function AudioPlayer({ src, thumbnailItem, caption, url, width, height, autoPlay, index }) 
{
  // Maustro
  autoPlay = false;
  
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
          url={url}
          inverted={false}
        />
      ) : (
        <>
          <Caption caption={caption} />
          <ProductLink url={url} />
        </>
      )}
      {!isPlaying && <PlayIcon inverted={!thumbnailUrl} />}
      <audio src={src} style={{display: "none"}} ref={audioRef} />
    </div>
  );
}
