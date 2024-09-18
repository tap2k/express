import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import videojs from 'video.js'
import 'videojs-errors';
import 'videojs-vr';
import '../node_modules/video.js/dist/video-js.css';
import '../node_modules/videojs-vr/dist/videojs-vr.css';
//import { useContainerSize } from '../hooks/usecontainersize';

export default function VideoPlayer360({ src, height, mediaRef, cover, setDuration, ...props }) 
{
  const [init, setInit] = useState(false);
  //const { containerSize, containerRef } = useContainerSize(height);

  useEffect(() => {
    //if (containerSize.width > 0 && containerSize.height > 0) {
      if (!mediaRef.current)
        return;
      mediaRef.current.player = loadPlayer();
      mediaRef.current.player.ready(function(){
          this.on('loadedmetadata', () => {setDuration(mediaRef.current.duration)});
      });
      const controlBar = mediaRef.current.player.getChild('ControlBar');
      controlBar.el_.style.zIndex = 100;
    //}

    return () => {
      if (mediaRef?.current?.player && mediaRef.current.player.vr().renderer)
          mediaRef.current.player.vr().renderer.dispose();
    }
  }, [mediaRef]);

  let projection = "Sphere";
  let filename = src.split('/').pop().toLowerCase();
  
  if (props.mapping == "cubemap") {
    projection = "Cube";
  } else if (props.mapping === "equirect180") {
    if (props.packing === "none") {
      projection = "180_MONO";
    } else {
      projection = "180_LR";
    }
  } else if (props.mapping == "equirect360") {
    if (props.packing === "leftright") {
      projection = "360_LR";
    } else if (props.packing === "topbottom") {
      projection = "360_TB";
    }
  } else {
    // Check filename if props.mapping is not set
    if (filename.includes('_180')) {
      projection = filename.includes('_lr') || filename.includes('_sbs') ? "180_LR" : "180_MONO";
    } else if (filename.includes('_360')) {
      if (filename.includes('_lr') || filename.includes('_sbs')) {
        projection = "360_LR";
      } else if (filename.includes('_tb') || filename.includes('_ou')) {
        projection = "360_TB";
      } else {
        projection = "360_MONO";
      }
    } else if (filename.includes('_fisheye')) {
      projection = "Fisheye";
    } else if (filename.includes('_cubemap')) {
      projection = "Cube";
    }
  }

  const loadPlayer = () => {      
    /*if (thumbnail)
      mediaRef.props = {bigPlayButton: false, controlBar: {fullscreenToggle: false, pictureInPictureToggle: false, volumePanel: false}, userActions: {doubleClick: false}, ...mediaRef.props};
    else */
    mediaRef.props = {controlBar: {fullscreenToggle: true, pictureInPictureToggle: false}, ...mediaRef.props};
    const player = videojs(mediaRef.current, mediaRef.props, function onPlayerReady() {
      const player = this;
      player.playsinline(true);
      player.mediainfo = player.mediainfo || {};
      player.mediainfo.projection = projection;
      player.vr({
        forceCardboard: false,
        motionControls: false,
      });
    });
    return player;

    /*player.on('touchstart', function() {
      if (player.paused())
        player.play();
      else
        player.pause();
    });*/

    /*player.width(containerSize.width);
    player.height(containerSize.height);*/
  }

  if (!init)
  {
    try {
      const mapref = useMap();
      if (mapref) {
        setInit(true);
        let marker = null;
  
        mapref.on('popupopen', function(e) {
          if (!marker && mediaRef?.current?.player)
            marker = e.popup._source;
          
          if (marker === e.popup._source && mediaRef?.current?.player)
          {
            mediaRef.current.player.load();
          }
        });
      
        mapref.on('popupclose', function(e) {
          if (!marker && mediaRef?.current?.player)
            marker = e.popup._source;
          
          if (marker === e.popup._source && mediaRef?.current?.player)
          {
            if (mediaRef.current.player.vr().renderer)
              mediaRef.current.player.vr().renderer.dispose();
          }
        });
      }
    } catch(error) {
      // To be expected if not in map
    }
  }

  const containerStyle = {
    width: '100%',
    //height: `${containerSize.height}px`
    height: '100%',
    minHeight: '250px'
  };

  let vjsclass = 'vjs-fill';
  if (cover)
    vjsclass = 'vjs-fluid';

  {/*<div ref={containerRef} data-vjs-player onClick={(e) => e.stopPropagation()} style={containerStyle}>
    <video crossOrigin="anonymous" preload='metadata' ref={mediaRef} className={`video-js vjs-default-skin ${vjsclass}`} width={containerSize.width} height={containerSize.height} {...props}>
      {props.children}
    </video>
  </div>*/}

  return (
    <div data-vjs-player onClick={(e) => e.stopPropagation()} style={containerStyle}>
      <video crossOrigin="anonymous" preload='metadata' ref={mediaRef} className={`video-js vjs-default-skin ${vjsclass}`} {...props}>
        {props.children}
      </video>
    </div>
  );
}