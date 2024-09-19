import { useState, useEffect, useContext, useCallback } from 'react';
import { CarouselContext } from 'pure-react-carousel';

export default function useMediaControl({mediaRef, index, autoPlay}) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const carouselContext = useContext(CarouselContext);

  const getPlayer = useCallback(() => {
    return mediaRef?.current?.player || mediaRef?.current;
  }, [mediaRef]);

  const play = useCallback(() => {
    const player = getPlayer();
    if (player) {
      setIsPlaying(true);
      player.play().catch(error => console.error('Playback failed:', error));
    }
  }, [getPlayer]);

  const pause = useCallback(() => {
    const player = getPlayer();
    if (player) {
      setIsPlaying(false);
      player.pause();
    }
  }, [getPlayer]);

  const toggle = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying, play, pause]);

  const reset = useCallback(() => {
    const player = getPlayer();
    if (player) {
      if (typeof player.currentTime == "function")
        player.currentTime(0);
      else
        player.currentTime = 0;
    }
  }, [getPlayer]);

  const goToNextSlide = useCallback(() => {
    if (carouselContext) {
      const nextSlideIndex = (carouselContext.state.currentSlide + 1) % carouselContext.state.totalSlides;
      carouselContext.setStoreState({ currentSlide: nextSlideIndex });
    }
  }, [carouselContext]);

  useEffect(() => {
    const onChange = () => {
      const player = getPlayer();
      if (!player) return;

      if (carouselContext.state.currentSlide === index) {
        if (autoPlay) {
          reset();
          play();
        }
      } else {
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

    const player = getPlayer();
    if (player) {
      if (typeof player.on === 'function') {
        player.on('ended', onEnded);
      } else if (typeof player.addEventListener === 'function') {
        player.addEventListener('ended', onEnded);
      }
    }
  
    if (carouselContext)
      carouselContext.subscribe(onChange);
  
    return () => {
      if (carouselContext)
        carouselContext.unsubscribe(onChange);
      if (player) {
        if (typeof player.off === 'function') {
          player.off('ended', onEnded);
        } else if (typeof player.removeEventListener === 'function') {
          player.removeEventListener('ended', onEnded);
        }
      }
    };
  }, [autoPlay, getPlayer, carouselContext, index]);

  useEffect(() => {
    if (!carouselContext) {
      if (autoPlay && getPlayer()) {
        reset();
        play();
      }
      return;
    }  
    
    if (autoPlay && carouselContext.state.currentSlide === index)
      play();
    else
      pause();
  }, [autoPlay, getPlayer, carouselContext, index, play, pause, reset]);

  return { isPlaying, play, pause, toggle };
};