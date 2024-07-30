// components/content.js

import getMediaURL from "../hooks/getmediaurl";
import FullImage from './fullimage';
import AudioPlayer from './audioplayer';
import VideoPlayer from './videoplayer';
import Caption from "./caption";
import mime from 'mime-types';

// getMediaInfo function
export function getMediaInfo(contentItem) {
  if (!contentItem)
    return {};
  const url = getMediaURL() + contentItem.mediafile?.url;
  const type = mime.lookup(url) || 'application/octet-stream';
  let videotype = "";
  
  if (type === 'video/ogg' || type === 'video/mp4' || type === 'video/webm') {
    videotype = type;
  }

  return { url, type, videotype };
}

export default function Content({ contentItem, width, height, autoPlay, showCaption = true, index }) 
{
  const { url, type, videotype } = getMediaInfo(contentItem);

  let videostyle = {};
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    videostyle = {width, height};
  }

  const containerStyle = {
    position: 'relative',
    width,
    height,
  };

  let mediaElement;

  if (type.startsWith("image")) {
    mediaElement = (
      <FullImage 
        src={url} 
        width={width} 
        height={height} 
      />
    );
  } else if (type.startsWith("audio")) {
    mediaElement = (
      <AudioPlayer 
        src={url} 
        width={width} 
        height={height} 
        thumbnailItem={contentItem.thumbnail} 
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
        src="gift.png" 
        width={width} 
        height={height} 
      />
    );
  }

  return (
    <div style={containerStyle}>
      {mediaElement}
      { showCaption ? <Caption 
        title={contentItem.description}
        url={contentItem.ext_url} 
        textAlignment={contentItem.textalignment} 
      /> : "" }
    </div>
  );
}
