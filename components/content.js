// components/content.js

import dynamic from "next/dynamic";
import { useRef, useState, memo } from "react";
import mime from 'mime-types';
import getMediaURL from "../hooks/getmediaurl";
import useMediaControl from "../hooks/usemediacontrol";
import FullImage from './fullimage';
import Caption from "./caption";
import PlayIcon from './playicon';

const Youtube = dynamic(() => import("./youtube.js"), { ssr: false });
const Photosphere = dynamic(() => import("./photosphere.js"), { ssr: false });
const VideoPlayer360 = dynamic(() => import("./videoplayer360.js"), { ssr: false });
const VideoPlayer = dynamic(() => import("./videoplayerjs.js"), { ssr: false });
const AudioPlayer = dynamic(() => import("./audioplayerjs.js"), { ssr: false });
const Timeline = dynamic(() => import("./timeline.js"), { ssr: false });

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
  return type && (type.startsWith("video") || type.startsWith("image") || type.startsWith("audio"));
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

    //if (type.startsWith("image") && thumbnail && contentItem.mediafile?.formats?.large?.url)
      //url = getMediaURL() + contentItem.mediafile.formats.large.url;

    if (type && (type.startsWith("video") || type.startsWith("image") || type.startsWith("audio")))
      return { url, type, videotype };
  }

  // TODO: audiofile cant be on dropbox
  if (contentItem.audiofile?.url)
  {
    url = getMediaURL() + contentItem.audiofile.url;
    const type = mime.lookup(url);
    if (type && type.startsWith("audio"))
      return { url, type };
  }

  return {url: "", type: ""};
}

export function Content({ contentItem, width, height, autoPlay, interval, caption, thumbnail, cover, controls, timeline, index, privateID, jwt, ...props }) 
{
  if (!contentItem)
    return;

  const mediaRef = useRef();
  const [player, setPlayer] = useState();
  const [duration, setDuration] = useState(20.0);
  const { isPlaying, toggle, play, pause } = useMediaControl({mediaRef, player, index, autoPlay});
  const { url, type, videotype } = getMediaInfo(contentItem, thumbnail);
  const is360 = url.indexOf("360") != -1 || url.indexOf("180") != -1 || contentItem.is360;

  const containerStyle = {
    position: 'relative',
    width,
    height: (privateID || jwt || mediaRef.current) && false ? 'calc(${height} - 20px)' : height,
    ...props.style
  };

  let mediaElement;
  if (type.startsWith("audio")) {
    mediaElement = (
      <>
        { contentItem.title && 
          <FullImage 
            width={width} 
            height={height} 
            cover={cover}
            style={{backgroundColor: contentItem.background_color ? contentItem.background_color : 'black'}}
          /> }
          <AudioPlayer 
            src={url} 
            width={width} 
            height={height}
            controls={controls}
            player={player}
            setPlayer={setPlayer}
            setDuration={setDuration}
            mediaRef={mediaRef}
            style={{backgroundColor: contentItem.background_color ? contentItem.background_color : 'black'}}
            oscilloscope={!contentItem.title}
          />
      </>
    );
  } else if (type.startsWith("video")) {
    if (is360)
      mediaElement = (
        <VideoPlayer360 
          src={url}
          width={width} 
          height={height}
          controls={controls}
          mediaRef={mediaRef}
          player={player}
          setPlayer={setPlayer}
          setDuration={setDuration}
          cover={cover}
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
          player={player}
          setPlayer={setPlayer}
          setDuration={setDuration}
          cover={cover}
        >
          <source src={url} type={videotype} />
        </VideoPlayer>
      );
  } else if (type.startsWith("youtube") || type.startsWith("vimeo")) {
      mediaElement = (
        <Youtube
          url={url} 
          width={width} 
          height={height}
          controls={controls}
          mediaRef={mediaRef}
          player={player}
          setPlayer={setPlayer}
          setDuration={setDuration}
        />
      );
  } else {
    if (type.startsWith("image")) {
      if (is360)
        mediaElement = (
          <>
            <Photosphere
              src={url} 
              width={width} 
              height={height} 
              mediaRef={mediaRef}
              controls={controls}
            />
            { contentItem.audiofile && 
              <AudioPlayer 
                src={getMediaURL() + contentItem.audiofile?.url} 
                width={'100%'} 
                height={'0px'}
                controls={controls}
                mediaRef={mediaRef}
                player={player}
                setPlayer={setPlayer}
                setDuration={setDuration}
                style={{position: 'absolute', bottom: 0}}
            /> }`
          </>
        );
      }
  }

  if (!mediaElement)
    mediaElement = (
      <>
        <FullImage 
          src={url} 
          width={width} 
          height={height} 
          cover={cover}
          controls={controls}
          style={{backgroundColor: contentItem.background_color ? contentItem.background_color : 'black'}}
        />
        { contentItem.audiofile && 
          <AudioPlayer 
            src={getMediaURL() + contentItem.audiofile?.url} 
            width={'100%'} 
            height={'0px'}
            controls={controls}
            mediaRef={mediaRef}
            player={player}
            setPlayer={setPlayer}
            setDuration={setDuration}
            style={{position: 'absolute', bottom: 0}}
        /> }
      </>
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
        foregroundColor={!type || type === "text" ? contentItem.foreground_color : null}
      /> } 
      { (type.startsWith("video") || type.startsWith("audio") || contentItem.audiofile?.url) && <PlayIcon isPlaying={isPlaying} toggle={toggle} /> }
      {/* TODO: Have the timeline? */}
      { ((privateID || jwt) && timeline) && 
        <Timeline 
          contentItem={contentItem} 
          interval={interval/1000.0} 
          mediaRef={mediaRef}
          player={player} 
          pause={pause} 
          duration={duration} 
          setDuration={setDuration} 
          privateID={privateID} 
          jwt={jwt} /> }
    </>
  );
}

export default memo(Content);
