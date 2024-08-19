/* components/myreactplayer.js */

import { useEffect, useRef, useContext, useState } from "react";
import { CarouselContext } from 'pure-react-carousel';
import ReactPlayer from 'react-player/lazy';

export default function MyReactPlayer({ url, width, height, controls, autoPlay, index }) 
{
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const carouselContext = useContext(CarouselContext);
    const videoRef = useRef();

    function play()
    {
        videoRef?.current?.getInternalPlayer()?.playVideo();
        setIsPlaying(true);
    }

    function pause()
    {
        videoRef?.current?.getInternalPlayer()?.pauseVideo();
        setIsPlaying(true);
    }

    const toggle = () => {
        isPlaying ? pause() : play();
    }

    const resetMedia = () => {
        videoRef?.current?.getInternalPlayer()?.seekTo(0);
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
            if (!videoRef?.current?.getInternalPlayer()) return;

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

        const onStateChange = (event) => {
            if (event.data === 0)
                goToNextSlide();
        };

        if (videoRef?.current?.getInternalPlayer() && autoPlay) {
            videoRef?.current?.getInternalPlayer().addEventListener("onStateChange", onStateChange)
        }

        carouselContext.subscribe(onChange);
        return () => {
            carouselContext.unsubscribe(onChange);
            if (videoRef?.current?.getInternalPlayer()) {
                videoRef?.current?.getInternalPlayer().removeEventListener("onStateChange", onStateChange);
            }
        };
    }, [autoPlay, videoRef, carouselContext]);

    useEffect(() => {
        if (autoPlay && carouselContext.state.currentSlide === index)
            play();
        else
            pause();
    }, [autoPlay, videoRef, carouselContext]);

    return (
        <div 
            style={{
                position: 'relative',
                width,
                height,
                backgroundColor: '#000',
                cursor: 'pointer',
                paddingTop: '56.25%' // 16:9 aspect ratio for video
            }} 
            onClick={toggle}
        >
            <ReactPlayer 
                ref={videoRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
                width='100%'
                height='100%'
                playsInline
                url={url}
                controls={controls}
            />
        </div>
  );
}
