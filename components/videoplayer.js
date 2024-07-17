/* components/videoplayer.js */

import { useLayoutEffect, useEffect, useRef, useContext } from "react";
import { CarouselContext } from 'pure-react-carousel';
//import videojs from 'video.js'
//import 'videojs-errors';
//import '../node_modules/video.js/dist/video-js.css';

export default function VideoPlayer({ caption, autoPlay, index, ...props }) 
{
  const videoRef = useRef();
  const carouselContext = useContext(CarouselContext);
  
  if (carouselContext) {
    useEffect(() => {
      function onChange() {
        if (!videoRef?.current)
          return;

        // not using videojs
        // const player = videoRef?.player;
        const player = videoRef?.current;
        if (carouselContext.state.currentSlide == index && autoPlay)
        {
          player.currentTime = 0;
          player.play();
        }
        else
        {
            player.pause();
            player.currentTime = 0;
        }
      }
      carouselContext.subscribe(onChange);
      return () => carouselContext.unsubscribe(onChange);
    }, [carouselContext]);
    /*useEffect(() => {
      if (videoRef?.player?.paused() && carouselContext.state.currentSlide == index && autoPlay)
      {
        videoRef.player.on('canplay', function() {
          videoRef.player.play();
        });
      }
    }, [videoRef]);*/
  }

  /*useLayoutEffect(() => {
    videoRef.props = {controlBar: {pictureInPictureToggle: false}, ...videoRef.props};
    videoRef.player = videojs(videoRef.current, videoRef.props, function onPlayerReady() {
      const player = this;
      player.playsinline(true);
    });
    videoRef.player.on('touchstart', function() {
      console.log("touching");
      if (videoRef.player.paused()) 
        playVideo();
      else 
        videoRef.player.pause();
    });
  }, [videoRef]);*/


  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  const itemtag = <video controls preload='metadata' ref={videoRef} className="video-js vjs-default-skin" playsInline {...props}>
    {props.children}
  </video>

  return (
    <span onClick={(e) => e.stopPropagation()}>
      caption ? 
        <div style={{position: 'relative'}}>{itemtag}<div style={{position: 'absolute', top: 50, maxHeight: "20%", overflowY: "auto", width: "70%", left: "15%", backgroundColor: 'rgba(0,0,0,.5)', color: 'rgba(255,255,255,1.0)', textAlign: 'center', whiteSpace: 'pre-wrap', fontSize: "xxx-large"}}>{caption}</div></div>
      : itemtag
    </span>
  );
}
