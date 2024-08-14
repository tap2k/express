import { useState, useEffect, useContext } from 'react';
import { CarouselContext } from 'pure-react-carousel';

export default function useMediaControl(mediaRef, index, autoPlay) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const carouselContext = useContext(CarouselContext);

  const play = () => {
    if (mediaRef?.current) {
      mediaRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing media:", error);
      });
    }
  }

  const pause = () => {
    if (mediaRef?.current) {
      mediaRef.current.pause();
      setIsPlaying(false);
    }
  }

  const toggle = () => {
    isPlaying ? pause() : play();
  }

  const resetMedia = () => {
    if (mediaRef?.current) {
      mediaRef.current.currentTime = 0;
    }
  }

  const goToNextSlide = () => {
    if (carouselContext) {
      const nextSlideIndex = (carouselContext.state.currentSlide + 1) % carouselContext.state.totalSlides;
      carouselContext.setStoreState({ currentSlide: nextSlideIndex });
    }
  }

  useEffect(() => {
    if (!carouselContext) return;

    const onChange = () => {
      if (!mediaRef?.current) return;

      if (carouselContext.state.currentSlide === index) {
        if (autoPlay) {
          resetMedia();
          play();
        }
      } else {
        pause();
        resetMedia();
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
  }, [carouselContext]);

  useEffect(() => {
    if (autoPlay && carouselContext.state.currentSlide === index)
      play();
    else
      pause();
  }, [autoPlay]);

  return { isPlaying, play, pause, toggle, resetMedia };
};