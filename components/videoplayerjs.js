import { useEffect } from "react";
import videojs from 'video.js'
import 'videojs-errors';
import '../node_modules/video.js/dist/video-js.css';

export default function VideoPlayer({ cover, mediaRef, player, setPlayer, ...props }) 
{
  useEffect(() => {
    if (!mediaRef.current)
      return;
    mediaRef.props = {bigPlayButton: false, controlBar: {pictureInPictureToggle: false}, ...mediaRef.props};
    const player = videojs(mediaRef.current, mediaRef.props);
    if (setPlayer)
      setPlayer(player);

    return () => {
      if (player)
          player.dispose();
    }
  }, [mediaRef]);

  let vjsclass = 'vjs-fill';
  if (cover)
    vjsclass = 'vjs-fluid';

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  // TODO: metadata?
  return (
      <span onClick={(e) => e.stopPropagation()}>
        <video crossOrigin="anonymous" preload='metadata' ref={mediaRef} className={`video-js vjs-default-skin ${vjsclass}`} playsInline {...props}>
          {props.children}
        </video>
      </span>
  );
}
