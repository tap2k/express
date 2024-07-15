/* components/videoplayer.js */

import { useLayoutEffect, useEffect, useRef, useContext } from "react";
import { CarouselContext } from 'pure-react-carousel';
import videojs from 'video.js'
import 'videojs-errors';
import '../node_modules/video.js/dist/video-js.css';
import { setErrorText } from '../hooks/seterror';

export default function VideoPlayer({ caption, autoPlay, index, ...props }) 
{
  const videoRef = useRef();
  const carouselContext = useContext(CarouselContext);
  //const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (carouselContext) {
    useEffect(() => {
      function onChange() {
        if (videoRef?.player?.paused() && carouselContext.state.currentSlide == index && autoPlay)
          videoRef.player.play();
        else
        {
          if (videoRef?.player && !videoRef.player.paused())
            videoRef.player.pause();
        }
      }
      carouselContext.subscribe(onChange);
      return () => carouselContext.unsubscribe(onChange);
    }, [carouselContext]);
    useEffect(() => {
      if (videoRef?.player?.paused() && carouselContext.state.currentSlide == index && autoPlay)
      {
        videoRef.player.on('canplay', function() {
          videoRef.player.play();
        });
      }
    }, [videoRef]);
  }
  else
    setErrorText("No carousel context found!");

  useLayoutEffect(() => {
    videoRef.props = {controlBar: {pictureInPictureToggle: false}, ...videoRef.props};
    videoRef.player = videojs(videoRef.current, videoRef.props, function onPlayerReady() {
      const player = this;
      player.playsinline(true);
    });
    /*videoRef.player.on('touchstart', function() {
      console.log("touching");
      if (videoRef.player.paused()) 
        playVideo();
      else 
        videoRef.player.pause();
    });*/
  }, [videoRef]);


  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  const itemtag = <video controls preload='metadata' ref={videoRef} className="video-js vjs-default-skin" playsInline {...props}>
    {props.children}
  </video>

  return (
    <span onClick={(e) => e.stopPropagation()}>
      caption ? 
        <div style={{position: 'relative'}}>{itemtag}<div style={{position: 'absolute', bottom: 50, maxHeight: "20%", overflowY: "auto", width: "70%", left: "15%", backgroundColor: 'rgba(0,0,0,.5)', color: 'rgba(255,255,255,.8)', textAlign: 'center', fontSize: "x-large"}}>{caption}</div></div>
      : itemtag
    </span>
  );
}
