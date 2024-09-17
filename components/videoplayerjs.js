import { useLayoutEffect} from "react";
import videojs from 'video.js'
import 'videojs-errors';
import '../node_modules/video.js/dist/video-js.css';

export default function VideoPlayer({ mediaRef, setDuration, cover, ...props }) 
{
  useLayoutEffect(() => {
      mediaRef.props = {bigPlayButton: false, controlBar: {pictureInPictureToggle: false}, ...mediaRef.props};
      mediaRef.player = videojs(mediaRef.current, mediaRef.props, function onPlayerReady() {
      mediaRef.current.player = this;
      //mediaRef.current.player.playsinline(true);
      mediaRef.player.ready(function(){
        this.on('loadedmetadata', () => {setDuration(mediaRef.current.duration)});
      });
    });

    return () => {
      if (mediaRef?.player)
          mediaRef.player.dispose();
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
