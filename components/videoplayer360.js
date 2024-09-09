/* components/videoplayer360.js */

import { useEffect } from 'react';
import videojs from 'video.js'
import 'videojs-errors';
import 'videojs-vr';
import '../node_modules/video.js/dist/video-js.css';
import '../node_modules/videojs-vr/dist/videojs-vr.css';

export default function VideoPlayer360({ width, height, thumbnail, mediaRef, setDuration, ...props }) 
{
  useEffect(() => {
    mediaRef.player = loadPlayer();
    mediaRef.player.ready(function(){
        this.on('loadedmetadata', () => {setDuration(mediaRef.current.duration)});
    });
    const controlBar = mediaRef.player.getChild('ControlBar');
    controlBar.el_.style.zIndex = 1000;
    return () => {
      if (mediaRef?.player && mediaRef.player.vr().renderer)
          mediaRef.player.vr().renderer.dispose();
    }
  }, [mediaRef]);

  let projection = "Sphere";

  if (props.mapping == "cubemap")
    projection = "Cube";

    if (props.mapping === "equirect180")
      if (props.packing === "none")
        projection = "180_MONO";
      else
        projection = "180_LR";
  
    if (props.mapping == "equirect360")
      if (props.packing === "leftright")
        projection = "360_LR";
      else if (props.packing === "topbottom")
        projection = "360_TB";

  const loadPlayer = () => {      
    if (thumbnail)
      mediaRef.props = {bigPlayButton: false, controlBar: {fullscreenToggle: false, pictureInPictureToggle: false, volumePanel: false}, userActions: {doubleClick: false}, ...mediaRef.props};
    else 
      mediaRef.props = {controlBar: {pictureInPictureToggle: false}, ...mediaRef.props};
    const player = videojs(mediaRef.current, mediaRef.props, function onPlayerReady() {
      const player = this;
      player.playsinline(true);
      player.mediainfo = player.mediainfo || {};
      player.mediainfo.projection = projection;
      player.vr({
        //projection: 'AUTO',
        //debug: true,
        forceCardboard: false,
        motionControls: false,
      });
    });
    player.on('touchstart', function() {
      if (player.paused())
        player.play();
      else
        player.pause();
    });
    return player;
  }

  return (
    <div data-vjs-player onClick={(e) => e.stopPropagation()} style={{width: width, height: height}}>
      <video crossOrigin="anonymous" preload='auto' ref={mediaRef} className="video-js vjs-default-skin" width={width} height={height} {...props}>
        {props.children}
      </video>
    </div>
    );
}
