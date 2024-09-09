// components/content.js

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import mime from 'mime-types';
import getMediaURL from "../hooks/getmediaurl";
import useMediaControl from "../hooks/usemediacontrol";
import useSlideAdvance from "../hooks/useslideadvance";
import FullImage from './fullimage';
import AudioPlayer from './audioplayer';
import VideoPlayer from './videoplayer';
import Caption from "./caption";
import PlayIcon from './playicon';
import Timeline from './timeline';

const MyReactPlayer = dynamic(() => import("./myreactplayer.js"), { ssr: false });
const Photosphere = dynamic(() => import("./photosphere.js"), { ssr: false });
const VideoPlayer360 = dynamic(() => import("./videoplayer360.js"), { ssr: false });

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
    return false;
  if (validateYouTubeUrl(url))
    return true;
  if (url.indexOf("googleusercontent") != -1)
    return true;
  if (url.indexOf("vimeo") != -1)
    return true;
  const type = mime.lookup(url);
  return type.startsWith("video") || type.startsWith("image") || type.startsWith("audio");
}

export function getMediaInfo(contentItem, thumbnail) {
  if (!contentItem)
    return { url: "", type: "" };

  let url = contentItem.mediafile?.url;
  if (!url)
    url = contentItem.ext_url;

  if (url)
  {
    if (validateYouTubeUrl(url))
      return { url, type: "youtube" };

    if (url.indexOf("googleusercontent") != -1)
    {
      //if (!thumbnail)
      //  url = url + "=w1920";
      return { url: url, type: "image/jpeg" };
    }

    if (url.indexOf("vimeo") != -1)
      return { url: url, type: "vimeo" };
  
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

    if (type.startsWith("image") && thumbnail && contentItem.mediafile?.formats?.large?.url)
      url = getMediaURL() + contentItem.mediafile.formats.large.url;

    if (type && (type.startsWith("video") || type.startsWith("image") || type.startsWith("audio")))
      return { url, type, videotype };
  }

  // TODO: audiofile cant be on dropbox
  if (contentItem.audiofile?.url)
  {
    url = getMediaURL() + contentItem.audiofile.url;
    const type = mime.lookup(url);
    if (type.startsWith("audio"))
      return { url, type };
  }

  return {url: "", type: "text"};
}

export default function Content({ contentItem, width, height, cover, controls, autoPlay, interval, caption, thumbnail, index, privateID, jwt }) 
{
  if (!contentItem)
    return;

  if (!interval)
    interval = 5000;

  const mediaRef = useRef();
  const [duration, setDuration] = useState(20.0);
  const { isPlaying, toggle, play, pause } = useMediaControl({mediaRef, index, autoPlay});
  useSlideAdvance({index, autoPlay, isPlaying, interval: contentItem.duration ? contentItem.duration : interval});
  const { url, type, videotype } = getMediaInfo(contentItem, thumbnail);
  const is360 = url.indexOf("360") != -1 || url.indexOf("180") != -1 || contentItem.is360;

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
        mediaRef={mediaRef}
        style={{backgroundColor: contentItem.background_color ? contentItem.background_color : 'black'}}
      />
    );
  } else if (type.startsWith("video")) {
    if (is360)
      mediaElement = (
        <VideoPlayer360 
          width={width} 
          height={height}
          controls={controls}
          mediaRef={mediaRef}
          setDuration={setDuration}
        >
          <source src={url} type={videotype} />
        </VideoPlayer360>
      );
    else
      mediaElement = (
        <VideoPlayer 
          width={width} 
          height={height}
          controls={controls}
          mediaRef={mediaRef}
        >
          <source src={url} type={videotype} />
        </VideoPlayer>
      );
  } else if (type.startsWith("youtube") || type.startsWith("vimeo")) {
      mediaElement = (
        <MyReactPlayer
          url={url} 
          width={width} 
          height={height}
          controls={controls}
          mediaRef={mediaRef}
          setDuration={setDuration}
        />
      );
  } else {
    if (type.startsWith("image")) {
      if (is360)
        mediaElement = (
          <Photosphere
            src={url} 
            width={width} 
            height={height} 
            audioUrl={contentItem.audiofile?.url ? getMediaURL() + contentItem.audiofile?.url : ""}
            mediaRef={mediaRef}
            controls={controls}
          />
        );
      }
  }

  if (!mediaElement)
    mediaElement = (
      <FullImage 
        src={url} 
        width={width} 
        height={height} 
        audioUrl={contentItem.audiofile?.url ? getMediaURL() + contentItem.audiofile?.url : ""}
        cover={cover}
        controls={controls}
        mediaRef={mediaRef}
        style={{backgroundColor: contentItem.background_color ? contentItem.background_color : 'black'}}
      />
    );

  return (
    <>
    <div style={containerStyle}>
      {mediaElement}
    </div>
      { caption && type != "youtube" && <Caption 
        title={contentItem.title}
        name={contentItem.textalignment == "center" ? contentItem.name : ""}
        url={contentItem.ext_url} 
        textAlignment={contentItem.textalignment} 
        size={thumbnail ? "small" : "medium"}
      /> } 
      { (type.startsWith("video") || type.startsWith("audio") || contentItem.audiofile?.url ) && <PlayIcon isPlaying={isPlaying} toggle={toggle} /> }
      { (privateID || jwt) && <Timeline contentItem={contentItem} interval={interval / 1000} mediaRef={mediaRef} isPlaying={isPlaying} pause={pause} duration={duration} setDuration={setDuration} privateID={privateID} jwt={jwt} />}
    </>
  );
}
