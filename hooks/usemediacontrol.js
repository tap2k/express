import { useState, useEffect, useContext } from 'react';
import { CarouselContext } from 'pure-react-carousel';

export default function useMediaControl({mediaRef, index, autoPlay}) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const carouselContext = useContext(CarouselContext);

  const play = () => {
    if (mediaRef?.current) {
      setIsPlaying(true);
      mediaRef.current.play();
    }
  }

  const pause = () => {
    if (mediaRef?.current) {
      setIsPlaying(false);
      mediaRef.current.pause();
    }
  }

  const toggle = () => {
    isPlaying ? pause() : play();
  }

  const reset = () => {
    mediaRef.current.currentTime = 0;
  }

  const goToNextSlide = () => {
    if (carouselContext) {
      const nextSlideIndex = (carouselContext.state.currentSlide + 1) % carouselContext.state.totalSlides;
      carouselContext.setStoreState({ currentSlide: nextSlideIndex });
    }
  }

  useEffect(() => {
    const onChange = () => {
      if (!mediaRef?.current) return;

      if (carouselContext.state.currentSlide === index) {
        if (autoPlay) {
          reset();
          play();
        }
      } else {
        // TODO: Make this wait to make it smoother?
        pause();
        reset();
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      reset();
      if (carouselContext && autoPlay)
        goToNextSlide();
    };

    if (mediaRef?.current) {
      if (!mediaRef.current.youtube)
        mediaRef.current.addEventListener('ended', onEnded);
    }

    if (carouselContext)
      carouselContext.subscribe(onChange);
    return () => {
      if (carouselContext)
        carouselContext.unsubscribe(onChange);
      if (mediaRef?.current) {
        if (!mediaRef.current.youtube)
          mediaRef.current.removeEventListener('ended', onEnded);
      }
    };
  }, [autoPlay, mediaRef, carouselContext]);

  useEffect(() => {
    if (!carouselContext)
    {
      if (autoPlay && mediaRef?.current)
      {
        reset();
        if (carouselContext && autoPlay)
        play();
      }
      return;
    }  
    
    if (autoPlay && carouselContext.state.currentSlide === index)
      play();
    else
      pause();
  }, [autoPlay, mediaRef, carouselContext]);

  return { isPlaying, play, pause, toggle };
};