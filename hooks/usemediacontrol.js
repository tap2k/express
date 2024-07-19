import { useState, useEffect, useContext } from 'react';
import { CarouselContext } from 'pure-react-carousel';

export default function useMediaControl (mediaRef, index, autoPlay) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const carouselContext = useContext(CarouselContext);

  const play = () => {
    if (mediaRef.current) {
      mediaRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing media:", error);
      });
    }
  }

  const pause = () => {
    if (mediaRef.current) {
      mediaRef.current.pause();
      setIsPlaying(false);
    }
  }

  const toggle = () => {
    isPlaying ? pause() : play();
  }

  const resetMedia = () => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = 0;
    }
  }

  useEffect(() => {
    if (!carouselContext) return;

    const onChange = () => {
      if (!mediaRef.current) return;

      if (carouselContext.state.currentSlide === index) {
        if (mediaRef.current.paused && autoPlay) {
          resetMedia();
          play();
        }
      } else {
        pause();
        resetMedia();
      }
    };

    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext, mediaRef, index, autoPlay, play, pause, resetMedia]);

  return { isPlaying, play, pause, toggle, resetMedia };
};

