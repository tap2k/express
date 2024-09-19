import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import videojs from 'video.js'
import 'videojs-errors';
import 'videojs-vr';
import '../node_modules/video.js/dist/video-js.css';
import '../node_modules/videojs-vr/dist/videojs-vr.css';

export default function VideoPlayer360({ src, height, cover, mediaRef, player, setPlayer, ...props }) 
{
  const [init, setInit] = useState(false);

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
    mediaRef.props = {controlBar: {fullscreenToggle: true, pictureInPictureToggle: false}, ...mediaRef.props};
    const player = videojs(mediaRef.current, mediaRef.props, function onPlayerReady() {
      const player = this;
      //player.on('loadedmetadata', () => {setDuration(player.duration())});
      player.playsinline(true);
      player.mediainfo = player.mediainfo || {};
      player.mediainfo.projection = projection;
      player.vr({
        forceCardboard: false,
        motionControls: false,
      });
    });
    const controlBar = player.getChild('ControlBar');
    controlBar.el_.style.zIndex = 100;
    return player;
  }

  useEffect(() => {
    if (!mediaRef.current)
      return;
    if (setPlayer)
      setPlayer(loadPlayer());

    return () => {
      if (player && player.vr().renderer)
          player.vr().renderer.dispose();
    }
  }, [mediaRef]);

  useEffect(() => {
    if (!init) {
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
              player.load();
            }
          });
        
          mapref.on('popupclose', function(e) {
            if (!marker && mediaRef?.current?.player)
              marker = e.popup._source;
            
            if (marker === e.popup._source && mediaRef?.current?.player)
            {
              if (player.vr().renderer)
                player.vr().renderer.dispose();
            }
          });
        }
      } catch(error) {
        // To be expected if not in map
      }
    }
  }, [init, mediaRef]);

  const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '250px'
  };

  let vjsclass = 'vjs-fill';
  if (cover)
    vjsclass = 'vjs-fluid';

  return (
    <div data-vjs-player onClick={(e) => e.stopPropagation()} style={containerStyle}>
      <video crossOrigin="anonymous" preload='metadata' ref={mediaRef} className={`video-js vjs-default-skin ${vjsclass}`} {...props}>
        {props.children}
      </video>
    </div>
  );
}