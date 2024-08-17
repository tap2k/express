// components/content.js

import mime from 'mime-types';
import useSlideAdvance from '../hooks/useslideadvance';
import getMediaURL from "../hooks/getmediaurl";
import FullImage from './fullimage';
import AudioPlayer from './audioplayer';
import VideoPlayer from './videoplayer';

export function getMediaInfo(url) {
  if (!url)
    return {url: "", type: "", videotype: ""};
  const type = mime.lookup(url) || 'application/octet-stream';
  let videotype = "";
  
  if (type === 'video/ogg' || type === 'video/mp4' || type === 'video/webm') {
    videotype = type;
  }

  return { url: getMediaURL() + url, type, videotype };
}

export default function Content({ itemUrl, audioUrl, width, height, cover, autoPlay, interval, index }) 
{
  const { url, type, videotype } = getMediaInfo(itemUrl);
  if (audioUrl)
    audioUrl = getMediaURL() + audioUrl;

  let videostyle = {};
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    videostyle = {width, height};
  }

  const containerStyle = {
    position: 'relative',
    width,
    height,
  };

  useSlideAdvance(
    index, 
    autoPlay && !type.startsWith("audio") && !type.startsWith("video"), 
    interval
  );

  let mediaElement;
  if (type.startsWith("audio")) {
    mediaElement = (
      <AudioPlayer 
        src={url} 
        width={width} 
        height={height} 
        autoPlay={autoPlay} 
        index={index} 
      />
    );
  } else if (type.startsWith("video")) {
    mediaElement = (
      <VideoPlayer 
        style={videostyle} 
        width={width} 
        height={height} 
        autoPlay={autoPlay} 
        index={index}
      >
        <source src={url} type={videotype} />
      </VideoPlayer>
    );
  } else {
    mediaElement = (
      <FullImage 
        src={url} 
        width={width} 
        height={height} 
        audioUrl={audioUrl}
        cover={cover}
        autoPlay={autoPlay} 
        index={index} 
      />
    );
  }

  return (
    <div style={containerStyle}>
      {mediaElement}
    </div>
  );
}
