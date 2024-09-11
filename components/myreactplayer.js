import { useEffect, useRef, useContext } from "react";
import { CarouselContext } from 'pure-react-carousel';
import ReactPlayer from 'react-player/lazy';

export default function MyReactPlayer({ url, width, height, controls, autoPlay, setDuration, mediaRef }) 
{
    const carouselContext = useContext(CarouselContext);
    const videoRef = useRef();

    useEffect(() => {
        if (mediaRef) {
            if (url.indexOf("vimeo") !== -1) {
                mediaRef.current = videoRef.current?.getInternalPlayer();
            } else {
                const mediaObject = {
                    play: () => videoRef.current?.getInternalPlayer()?.playVideo(),
                    pause: () => videoRef.current?.getInternalPlayer()?.pauseVideo(),
                    getCurrentTime: () => videoRef.current?.getInternalPlayer()?.getCurrentTime() || 0,
                    getDuration: () => videoRef.current?.getInternalPlayer()?.getDuration() || 0,
                    seekTo: (time) => videoRef.current?.getInternalPlayer()?.seekTo(time),
                    youtube: true
                };
        
                Object.defineProperty(mediaObject, 'currentTime', {
                    get: function() {
                        return this.getCurrentTime();
                    },
                    set: function(value) {
                        this.seekTo(value);
                    }
                });
        
                mediaRef.current = mediaObject;
            }
        }
    }, [mediaRef, url]);

    const goToNextSlide = () => {
        if (carouselContext) {
            const nextSlideIndex = (carouselContext.state.currentSlide + 1) % carouselContext.state.totalSlides;
            carouselContext.setStoreState({ currentSlide: nextSlideIndex });
        }
    }

    const onStateChange = (event) => {
        if (event.data === -1)
            setDuration(videoRef.current?.getInternalPlayer()?.getDuration());
        if (event.data === 0 && autoPlay) {
            goToNextSlide();
        }
    };

    const setListeners = () => {
        if (videoRef?.current?.getInternalPlayer()) {
            setDuration(videoRef.current?.getInternalPlayer()?.getDuration());
            videoRef.current.getInternalPlayer().addEventListener("onStateChange", onStateChange);
        }
    }

    const removeListeners = () => {
        if (videoRef?.current?.getInternalPlayer()) {
            videoRef.current.getInternalPlayer().removeEventListener("onStateChange", onStateChange);
        }
    }

    useEffect(() => {
        return () => {
            removeListeners();
        };
    }, []);

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
                onReady={setListeners}
                config={{
                    youtube: {
                        playerVars: { origin: window.location.origin, fs: 1 }
                    }
                }}
                light
            />
        </div>
    );
}