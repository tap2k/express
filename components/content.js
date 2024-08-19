// components/content.js

import dynamic from "next/dynamic";
import mime from 'mime-types';
import getMediaURL from "../hooks/getmediaurl";
import FullImage from './fullimage';
import AudioPlayer from './audioplayer';
import VideoPlayer from './videoplayer';

const MyReactPlayer = dynamic(() => import("./myreactplayer.js"), { ssr: false });

function validateYouTubeUrl(urlToParse){
  if (urlToParse) {
      var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      if (urlToParse.match(regExp)) {
          return true;
      }
  }
  return false;
}

export function isMediaFile(url)
{
  if (!url)
    return null;
  if (validateYouTubeUrl(url))
    return true;
  const type = mime.lookup(url);
  return type.startsWith("video") || type.startsWith("image") || type.startsWith("audio");
}

export function getMediaInfo(contentItem) {
  let url = contentItem.mediafile?.url;
  if (!url)
    url = contentItem.ext_url;

  if (url)
  {
    if (validateYouTubeUrl(url))
      return { url, type: "youtube" };

    if (url.startsWith("https://www.dropbox.com")) {
      if (url.endsWith("?dl=0") || url.endsWith("?dl=1"))
        url = ext_url.substring(0, url.length - 5);
      url = ext_url.replace("https://www.dropbox.com", "https://dl.dropboxusercontent.com");
    }
    else
      url = getMediaURL() + url;

    const type = mime.lookup(url);

    let videotype = "";
    if (type === 'video/ogg' || type === 'video/mp4' || type === 'video/webm')
      videotype = type;

    if (type.startsWith("video") || type.startsWith("image") || type.startsWith("audio"))
      return { url, type, videotype };

    return { url: "", type: "" };
  }

  // TODO: audiofile cant be on dropbox
  if (contentItem.audiofile?.url)
  {
    url = getMediaURL() + contentItem.audiofile.url;
    const type = mime.lookup(url);
    if (type.startsWith("audio"))
      return { url, type };
  }

  return {url: "", type: ""};
}

export default function Content({ contentItem, width, height, cover, controls, autoPlay, interval, index }) 
{
  const { url, type, videotype } = getMediaInfo(contentItem);
    
  let videostyle = {};
  if (type.startsWith("video") && !Number.isFinite(width) || !Number.isFinite(height)) {
    videostyle = {width, height};
  }

  const containerStyle = {
    position: 'relative',
    width,
    height,
  };

  let mediaElement;
  if (type.startsWith("audio")) {
    mediaElement = (
      <AudioPlayer 
        src={url} 
        width={width} 
        height={height}
        controls={controls}
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
        controls={controls}
        autoPlay={autoPlay} 
        index={index}
      >
        <source src={url} type={videotype} />
      </VideoPlayer>
    );
  } else if (type.startsWith("youtube")) {
      mediaElement = (
        <MyReactPlayer 
          width={width} 
          height={height}
          controls={controls}
          autoPlay={autoPlay} 
          index={index}
          url={url}
        />
      );
  } else {
    mediaElement = (
      <FullImage 
        src={url} 
        width={width} 
        height={height} 
        audioUrl={contentItem.audiofile?.url ? getMediaURL() + contentItem.audiofile?.url : ""}
        cover={cover}
        controls={controls}
        autoPlay={autoPlay} 
        interval={interval}
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
