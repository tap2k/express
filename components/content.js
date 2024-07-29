/* components/content.js */

import getMediaURL from "../hooks/getmediaurl";
import FullImage from './fullimage';
import AudioPlayer from './audioplayer';
import VideoPlayer from './videoplayer';
import mime from 'mime-types';

// New function to get media info
export function getMediaInfo(contentItem) {
  if (!contentItem)
    return;
  const url = getMediaURL() + contentItem.mediafile?.url;
  const type = mime.lookup(url) || 'application/octet-stream';
  let videotype = "";
  
  if (type === 'video/ogg' || type === 'video/mp4' || type === 'video/webm') {
    videotype = type;
  }

  return { url, type, videotype };
}

export default function Content({ contentItem, width, height, autoPlay, index }) 
{
  const { url, type, videotype } = getMediaInfo(contentItem);

  let videostyle = {};
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    videostyle = {width, height};
  }

  const { description: caption, ext_url } = contentItem;
  let itemtag = null;

  if (type.startsWith("image")) {
    itemtag = <FullImage src={url} width={width} height={height} caption={caption} url={ext_url} />;
  } else if (type.startsWith("audio")) {
    itemtag = <AudioPlayer src={url} width={width} height={height} caption={caption} url={ext_url} thumbnailItem={contentItem.thumbnail} autoPlay={autoPlay} index={index} />;
  } else if (type.startsWith("video")) {
    itemtag = (
      <VideoPlayer style={videostyle} width={width} height={height} caption={caption} url={ext_url} autoPlay={autoPlay} index={index}>
        <source src={url} type={videotype} />
      </VideoPlayer>
    );
  } else {
    itemtag = <FullImage src="gift.png" width={width} height={height} caption={caption} url={ext_url} />;
  }

  return itemtag;
}