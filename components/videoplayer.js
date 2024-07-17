/* components/videoplayer.js */

import { useLayoutEffect, useEffect, useRef, useContext, useState } from "react";
import { CarouselContext } from 'pure-react-carousel';
//import videojs from 'video.js'
//import 'videojs-errors';
//import '../node_modules/video.js/dist/video-js.css';

export default function VideoPlayer({ caption, autoPlay, index, ...props }) 
{
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };
  
  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const toggleVideo = () => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  };
 
  const carouselContext = useContext(CarouselContext);
  
  if (carouselContext) {
    useEffect(() => {
      function onChange() {
        if (!videoRef?.current)
          return;

        // not using videojs
        // const player = videoRef?.player;
        const player = videoRef?.current;
        if (carouselContext.state.currentSlide == index)
        {
          if ( player.paused && autoPlay )
          {
            player.currentTime = 0;
            playVideo();
          }
        }
        else
        {
            pauseVideo();
            player.currentTime = 0;
        }
      }
      carouselContext.subscribe(onChange);
      return () => carouselContext.unsubscribe(onChange);
    }, [carouselContext]);
  }

  const itemtag = <video onClick={toggleVideo} preload='metadata' ref={videoRef} playsInline {...props}>
    {props.children}
  </video>

  return (
    <div>
      { caption ? 
        <div style={{position: 'relative'}}>{itemtag}<div style={{position: 'absolute', top: 50, maxHeight: "20%", overflowY: "auto", width: "70%", left: "15%", backgroundColor: 'rgba(0,0,0,.5)', color: 'rgba(255,255,255,1.0)', textAlign: 'center', whiteSpace: 'pre-wrap', fontSize: "xxx-large"}}>{caption}</div></div>
      : itemtag }
      { isPlaying ? "" : <img src="playicon.png" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20%', maxWidth: 200, pointerEvents: 'none'}} />}
    </div>
  );
}
