/* components/content.js */

//import dynamic from "next/dynamic";
import getMediaURL from "../hooks/getmediaurl";
import FullImage from './fullimage';
import AudioPlayer from './audioplayer';
import VideoPlayer from './videoplayer';

export default function Content({ contentItem, width, height, autoPlay, index }) 
{
  if (!contentItem.mediafile?.url)
    return;

  const url = getMediaURL() + contentItem.mediafile.url;

  const mime = require('mime-types');
  const type = mime.lookup(url) || 'application/octet-stream';
  let videotype = "";
  // TODO: hack for videojs
  if (type == 'video/ogg' || type == 'video/mp4' || type == 'video/webm')
    videotype = type;

  // TODO: this is hacky
  let videostyle = {};
  if (!Number.isFinite(width) || !Number.isFinite(width)) 
    videostyle = {width: width, height: height};

  let caption = contentItem.description;
  let itemtag = null;

  if (type.startsWith("image"))
    itemtag = <FullImage src={url} width={width} height={height} caption={caption} />;
  if (type.startsWith("audio"))
    itemtag = <AudioPlayer src={url} width={width} height={height} caption={caption} thumbnailItem={contentItem.thumbnail} autoPlay={autoPlay} index={index} />;
  if (type.startsWith("video"))
    itemtag = <VideoPlayer style={videostyle} width={width} height={height} caption={caption} autoPlay={autoPlay} index={index}><source src={url} type={videotype} /></VideoPlayer>;

  return itemtag;
}
