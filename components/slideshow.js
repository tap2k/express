import { useRouter } from 'next/router';
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { CarouselProvider, CarouselContext, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import '../node_modules/pure-react-carousel/dist/react-carousel.es.css';
import { FaExpandArrowsAlt, FaPlay, FaPause, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import getMediaURL from "../hooks/getmediaurl";
import updateSubmission from '../hooks/updatesubmission';
import ChannelControls from "./channelcontrols"
import ItemControls from "./itemcontrols"
import FullImage from "./fullimage";
import Content, { getMediaInfo } from "./content";
import Uploader from "./uploader";
//import FileUploader from "./uploader";
//import SlideButton from "./slidebutton";

const defaultInterval = 5000;

const downloadURL = async (dlurl) => {
  if (!dlurl) return;
  try {
    const response = await fetch(getMediaURL() + dlurl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = url.split('/').pop();
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed: " + err);
  }
}

const SlideTracker = ({ setCurrSlide, getCurrentContent, isPlaying, interval, togglePlayPause, toggleFullScreen}) => {
  const carouselContext = useContext(CarouselContext);
  const timerRef = useRef(null);

  const advanceSlide = useCallback(() => {
    if (!carouselContext) return;
    const nextSlideIndex = (carouselContext.state.currentSlide + 1) % carouselContext.state.totalSlides;
    carouselContext.setStoreState({ currentSlide: nextSlideIndex });
  }, [carouselContext]);

  const retreatSlide = useCallback(() => {
    if (!carouselContext) return;
    const total = carouselContext.state.totalSlides;
    const prevSlideIndex = (carouselContext.state.currentSlide - 1 + total) % total;
    carouselContext.setStoreState({ currentSlide: prevSlideIndex });
  }, [carouselContext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      switch (e.key) {
        case 'ArrowRight': advanceSlide(); break;
        case 'ArrowLeft': retreatSlide(); break;
        case ' ': e.preventDefault(); togglePlayPause(); break;
        case 'f': toggleFullScreen(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advanceSlide, retreatSlide, togglePlayPause, toggleFullScreen]);

  useEffect(() => {
    const onChange = () => {
      setCurrSlide(carouselContext.state.currentSlide);
    };
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext, setCurrSlide]);

  useEffect(() => {
    if (!isPlaying) {
      clearTimeout(timerRef.current);
      return;
    }

    const currentContent = getCurrentContent();
    if (currentContent?.duration)
      interval = currentContent.duration * 1000;

    const mediaType = getMediaInfo(currentContent).type;
    if ((mediaType.startsWith("image") || !mediaType) && !currentContent?.audiofile?.url) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(advanceSlide, interval);
    } else {
      clearTimeout(timerRef.current);
    }

    return () => clearTimeout(timerRef.current);
  }, [isPlaying, carouselContext.state.currentSlide, getCurrentContent, interval, advanceSlide]);
};

export default function Slideshow({ channel, height, width, buttons, thumbnail, hideTitle, startSlide, isInactive, privateID, jwt, ...props }) 
{
  if (!channel) return;

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currSlide, setCurrSlide] = useState(parseInt(startSlide) || 0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  // TODO: Dont need this?
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [likedSlides, setLikedSlides] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const router = useRouter();
  
  const showTitle = (channel.showtitle || privateID || jwt) && !hideTitle;

  const getCurrentContent = useCallback(() => {
    const index = showTitle ? currSlide - 1 : currSlide;
    return (index >= 0 && index < channel.contents.length) ? channel.contents[index] : null;
  }, [showTitle, currSlide, channel.contents]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    setIsModalOpen(isUploadModalOpen);
  }, [isUploadModalOpen]);

  useEffect(() => {
    if (!audioRef.current)
      return;
    if (isPlaying)
      audioRef.current.play();
    else
      audioRef.current.pause();
    // TODO: What if its not playing?
    const mediaType = getMediaInfo(getCurrentContent()).type;
    mediaType?.startsWith('video/') || mediaType?.startsWith('audio/') || mediaType?.startsWith('youtube') || mediaType?.startsWith('vimeo') ? audioRef.current.volume = 0.4 :  audioRef.current.volume = 0.8;
  }, [currSlide, isPlaying]);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  const copyUrlToClipboard = () => {
    const baseurl = new URL(window.location.href);
    const url = `${baseurl.origin}${baseurl.pathname}?channelid=${channel.uniqueID}&currslide=${currSlide}`;  
    navigator.clipboard.writeText(url)
      .then(() => alert('URL copied to clipboard!'))
      .catch(err => console.error('Failed to copy URL: ', err));
  };

  /*const handleHeartClick = () => {
    setLikedSlides(prevLikedSlides => 
      prevLikedSlides.includes(currSlide)
        ? prevLikedSlides.filter(index => index !== currSlide)
        : [...prevLikedSlides, currSlide]
    );
  };*/
  
  const moveSlide = async (increment) => {
    const contentIndex = showTitle ? currSlide - 1 : currSlide;
    if ((contentIndex + increment) < 0 || (contentIndex + increment) >= channel.contents.length) return;
    const contentToMove = channel.contents[contentIndex];
    if (contentToMove) {
      await updateSubmission({contentID: contentToMove.id, order: channel.contents[contentIndex + increment].order, privateID, jwt});
      const newQuery = { 
        ...router.query, 
        currslide: Math.min(currSlide + increment, showTitle ? channel.contents.length : channel.contents.length - 1)
      };
      setCurrSlide(currSlide + increment);
      router.replace({ pathname: router.pathname, query: newQuery });
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const iconBarStyle = {
    position: 'fixed',
    display: 'flex',
    backgroundColor: 'rgba(50, 50, 50, 0.5)',
    padding: 'clamp(8px, 0.5vh, 20px)',
    borderRadius: 'clamp(10px, 2vh, 20px)',
    alignItems: 'center',
    zIndex: 1
  };

  const iconButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: 'clamp(8px, 1.5vh, 20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'clamp(16px, 2vh, 32px)',
  };

  const slideButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20%',
    height: '60%',
    opacity: 0,
    background: 'transparent',
    border: 'none',
    zIndex: 1
  }

  const slideButtonStyle2 = {
    position: 'absolute', 
    top: '50%', 
    transform: 'translateY(-50%)',
    opacity: '0.5', 
    width: 'clamp(30px, 5%, 40px)', 
    aspectRatio: '1 / 1', 
    border: '1px solid gray', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: 'calc(clamp(30px, 5%, 50px) * 0.5)'
  }

  const hasImage = !!channel.picture?.url;
  const overlayColor = channel.foreground_color || '#E6F0FF99';
  const overlayHex = (channel.foreground_color || '#E6F0FF').replace('#', '').substring(0, 6);
  const bgHex = (channel.background_color || '#FFFFFF').replace('#', '').substring(0, 6);
  const lightOverlay = (parseInt(overlayHex.substr(0,2),16)*299 + parseInt(overlayHex.substr(2,2),16)*587 + parseInt(overlayHex.substr(4,2),16)*114) / 1000 > 128;
  const lightBg = (parseInt(bgHex.substr(0,2),16)*299 + parseInt(bgHex.substr(2,2),16)*587 + parseInt(bgHex.substr(4,2),16)*114) / 1000 > 128;
  const fgAsTextColor = channel.foreground_color ? '#' + channel.foreground_color.replace('#', '').substring(0, 6) : null;
  const textColor = hasImage
    ? (lightOverlay ? '#0a4f6a' : '#fff')
    : (fgAsTextColor || (lightBg ? '#0a4f6a' : '#fff'));
  const textOutlineStyle = hasImage ? {
    textShadow: lightOverlay
        ? '0 1px 3px rgba(0,0,0,0.3)'
        : '-1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333',
    color: textColor
  } : {
    color: textColor
  };

  const containerStyle = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      ...(hasImage ? {
        backgroundColor: overlayColor,
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
      } : {}),
      padding: '30px 70px',
      width: 'max-content',
      maxWidth: '80%',
      minWidth: '30%',
      boxSizing: 'border-box',
      textAlign: 'center',
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
      hyphens: 'auto'
  };

  const titleStyle = {
    fontSize: thumbnail ? '24px' : 'clamp(32px, 4.5vh, 64px)',
    lineHeight: '1.2',
    fontWeight: 'bold',
    ...textOutlineStyle
  };

  const descriptionStyle = {
      fontSize: thumbnail ? '18px' : 'clamp(18px, 3vh, 32px)',
      lineHeight: '1.2',
      marginTop: '10px',
      ...textOutlineStyle
  };  

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle} title="Close">&times;</button>
  );

  return (
    <div style={{width: width, display: "flex", flexDirection: "column", ...props.style}}>
      { !buttons && <div className="hide-on-inactive" style={{
        ...iconBarStyle, 
        bottom: '20px', 
        // TODO: controls?
        //bottom: '10px',
        left: '50%', 
        transform: 'translateX(-50%)', 
        gap: '25px'
      }}>
        <button onClick={toggleFullScreen} style={iconButtonStyle} title="Toggle fullscreen">
          <FaExpandArrowsAlt />
        </button>
        <button onClick={togglePlayPause} style={iconButtonStyle} title={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button
          title="Download"
          onClick={async () => {
            if (showTitle && currSlide == 0) {
              await downloadURL(channel.picture?.url);
              await downloadURL(channel.audiofile?.url);
            }
            const currentContent = getCurrentContent();
            if (currentContent) {
              await downloadURL(currentContent.mediafile?.url);
              await downloadURL(currentContent.audiofile?.url);
            } 
          }} 
          style={iconButtonStyle}
        >
          <FaDownload />
        </button>
        {/*
          <button 
            onClick={handleHeartClick} 
            style={{...iconButtonStyle, color: likedSlides.includes(currSlide) ? 'red' : 'white'}}
          >
            <FaHeart />
          </button>
        */}
      </div>}

      <div style={{width: width, height: height, position: "relative"}}>
        <CarouselProvider 
          isIntrinsicHeight 
          totalSlides={showTitle ? channel.contents.length + 1 : channel.contents.length} 
          touchEnabled={false} 
          dragEnabled={false} 
          infinite 
          currentSlide={currSlide}
        >
          <SlideTracker setCurrSlide={setCurrSlide} getCurrentContent={getCurrentContent} isPlaying={isPlaying} interval={channel.interval || defaultInterval} togglePlayPause={togglePlayPause} toggleFullScreen={toggleFullScreen} />
          <Slider style={{height: height, width: width}}>
            {showTitle && (
              <Slide style={{height: height, width: width}}>
                <div style={{position: 'relative', height: '100%', width: '100%', backgroundColor: channel.background_color || 'white'}}>
                  <FullImage 
                    src={channel.picture?.url ? getMediaURL() + channel.picture?.url : ""} 
                    width={width} 
                    height={height} 
                    index={0}
                    cover
                    autoPlay={isPlaying}
                    interval={channel.interval}
                  />
                  <div style={containerStyle}>
                    <div style={titleStyle}>
                      {channel.name}
                    </div>
                    <div style={descriptionStyle}>
                      {channel.description}
                    </div>
                    {(privateID || jwt) && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        zIndex: 10,
                      }}>
                        <ChannelControls channel={channel} privateID={privateID} iconSize={24} setIsModalOpen={setIsModalOpen} jwt={jwt} />
                      </div>
                    )}
                  </div>
                </div>
              </Slide> 
            )}
            {channel.contents && channel.contents.map((contentItem, index) => {
              index = showTitle ? index + 1 : index;
              // TODO: Only render current slide
              return (
                <Slide style={{height: height, width: width}} key={index} index={index}> 
                  {(Math.abs(currSlide - index) <= 1 || 
                    (index === 0 && currSlide === channel.contents.length - 1) || 
                    (index === channel.contents.length - 1 && currSlide === 0)) && <Content 
                    key={contentItem.id} 
                    contentItem={contentItem}
                    width={width} 
                    height={height} 
                    autoPlay={isPlaying} 
                    interval={channel.interval || defaultInterval} 
                    index={index}
                    cover={contentItem.mediafile?.url?.includes("maustrocard")}
                    caption={!hideTitle || contentItem.mediafile?.url?.includes("maustrocard") || contentItem.background_color}
                    controls
                    thumbnail={thumbnail}
                  />}
                </Slide>
              );
            })}
          </Slider>
          {channel.contents.length > 0 && (
            /*<>
            <SlideButton increment={-1} style={{left: 0, cursor: 'w-resize', ...slideButtonStyle}} />
            <SlideButton increment={1} style={{right: 0, cursor: 'e-resize', ...slideButtonStyle}} />
            </>*/
            buttons ? <>
              <ButtonBack key={1} className="hide-on-inactive" style={{...slideButtonStyle2, left: '1%'}} title="Previous slide"><FaChevronLeft /></ButtonBack>
              <ButtonNext key={2} className="hide-on-inactive" style={{...slideButtonStyle2, right: '1%'}} title="Next slide"><FaChevronRight /></ButtonNext>
            </> :
            <>
              <ButtonBack style={{left: 0, cursor: 'w-resize', ...slideButtonStyle}} title="Previous slide" />
              <ButtonNext style={{right: 0, cursor: 'e-resize', ...slideButtonStyle}} title="Next slide" />
            </>
          )}
        </CarouselProvider>
      </div>

      <Modal isOpen={isUploadModalOpen} toggle={() => setIsUploadModalOpen(false)}>
        <ModalHeader toggle={() => setIsUploadModalOpen(false)} close={closeBtn(() => setIsUploadModalOpen(false))} />
        <ModalBody>
          <Uploader
              channelID={channel.uniqueID}
              toggle={() => setIsUploadModalOpen(false)}
              privateID={privateID}
              jwt={jwt}
          />
        </ModalBody>
      </Modal>

      {(privateID || jwt) && (
        <div className="hide-on-inactive" style={{
          position: 'absolute',
          top: 5,
          right: 5
        }}>
          { !(showTitle && currSlide === 0) && 
            <ItemControls 
              contentItem={getCurrentContent()} 
              privateID={privateID} 
              flex="column" 
              iconSize={'calc(0.8vmin + 1.0em)'} 
              moveSlide={moveSlide}
              setIsModalOpen={setIsModalOpen} 
              jwt={jwt}
              publisher
              slideshow />
            }
        </div>
      )}

      {channel.audiofile?.url && (
        <audio
          ref={audioRef}
          src={getMediaURL() + channel.audiofile.url}
          loop
          style={{ display: 'none' }}
        />
      )}
      
    </div>
  );
}
