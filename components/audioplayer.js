/* components/audioplayer.js */

import { useEffect, useRef, useContext, useState } from "react";
import { CarouselContext } from 'pure-react-carousel';
import getMediaURL from "../hooks/getmediaurl";
import { setErrorText } from '../hooks/seterror';
import FullImage from '../components/fullimage';

export default function AudioPlayer({ src, thumbnailItem, caption, width, height, autoPlay, index, ...props }) 
{
  const audioRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  let thumbnailUrl = "";
  if (thumbnailItem?.url)
    thumbnailUrl = getMediaURL() + thumbnailItem.url;

  function toggleAudio()
  {
    if (audioRef?.current)
    {
      if (audioRef.current.paused)
        audioRef.current.play();
      else
        audioRef.current.pause();
    }
  }

  const carouselContext = useContext(CarouselContext);
  if (carouselContext) {
    function nextSlide()
    {
      if (carouselContext.state.currentSlide < carouselContext.state.totalSlides - 1)
        carouselContext.setStoreState({ currentSlide: carouselContext.state.currentSlide + 1 });
    }    
      
    useEffect(() => {
      function onChange() {
        if (!audioRef?.current)
          return;

        if (carouselContext.state.currentSlide == 0 && !audioRef.current.pause())
        {
          audioRef.current.currentTime = 0;
          audioRef.current.pause();
        }
        
        if (carouselContext.state.currentSlide == index)
        {
          if (audioRef.current?.paused && autoPlay)
          {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            /* if (autoPlay)
              audioRef.current.onended = nextSlide;*/
          }
        }
        else
        {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
      carouselContext.subscribe(onChange);
      return () => carouselContext.unsubscribe(onChange);
    }, [carouselContext]);
  }
  else
    setErrorText("No carousel context found!");

  useEffect(() => {
    if (!audioRef?.current)
      return;
    audioRef.current.onplay = () => {setIsPlaying(true)};
    audioRef.current.onpause = () => {setIsPlaying(false)};
  }, [audioRef]);

  if (thumbnailUrl)
    return (
      <div style={{position: 'relative'}} onClick={() => toggleAudio()}>
        <FullImage src={thumbnailUrl} width={width} height={height} caption={caption} />
        {isPlaying ? "" : <img src="playicon.png" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20%', maxWidth: 200}} />}
        <audio src={src} style={{display: "none"}} ref={audioRef} {...props} />
      </div>
  );
  
  return (
    <div style={{position: 'relative', margin: '0 auto', width: width, height: height}} onClick={() => toggleAudio()}>
      <audio src={src} controls ref={audioRef} style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: Number.isFinite(width) ? width - 20 : '30%'}} {...props} />
    </div>
  );
}