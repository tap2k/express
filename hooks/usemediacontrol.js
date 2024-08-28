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

  const goToNextSlide = () => {
    if (carouselContext) {
      const nextSlideIndex = (carouselContext.state.currentSlide + 1) % carouselContext.state.totalSlides;
      carouselContext.setStoreState({ currentSlide: nextSlideIndex });
    }
  }

  useEffect(() => {
    if (!carouselContext)
      return;

    const onChange = () => {
      if (!mediaRef?.current) return;

      if (carouselContext.state.currentSlide === index) {
        if (autoPlay) {
          mediaRef.current.currentTime = 0;
          play();
        }
      } else {
        // TODO: Make this wait to make it smoother?
        pause();
        mediaRef.current.currentTime = 0;
      }
    };

    const onEnded = () => {
      goToNextSlide();
    };

    if (mediaRef?.current && autoPlay) {
      mediaRef.current.addEventListener('ended', onEnded);
    }

    carouselContext.subscribe(onChange);
    return () => {
      carouselContext.unsubscribe(onChange);
      if (mediaRef?.current) {
        mediaRef.current.removeEventListener('ended', onEnded);
      }
    };
  }, [autoPlay, mediaRef, carouselContext]);

  useEffect(() => {
    if (!carouselContext)
    {
      if (autoPlay && mediaRef?.current)
      {
        mediaRef.current.currentTime = 0;
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