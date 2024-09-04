import { useState, useEffect, useContext, useRef } from "react";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { CarouselProvider, CarouselContext, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import '../node_modules/pure-react-carousel/dist/react-carousel.es.css';
import { FaExpandArrowsAlt, FaPlus, FaPaperclip, FaPlay, FaPause, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import getMediaURL from "../hooks/getmediaurl";
import ChannelControls from "./channelcontrols"
import ItemControls from "./itemcontrols"
import FullImage from "./fullimage";
import Content, { getMediaInfo } from "./content";
import Uploader from "./uploader";
import ContentEditor from "./contenteditor";

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

const SlideTracker = ({ setCurrSlide }) => {
  const carouselContext = useContext(CarouselContext);

  useEffect(() => {
    const onChange = () => {
      setCurrSlide(carouselContext.state.currentSlide);
    };
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);

  return null;
};

export default function Slideshow({ channel, height, width, startSlide, isInactive, privateID, jwt, ...props }) 
{
  if (!channel) return;

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currSlide, setCurrSlide] = useState(parseInt(startSlide) || 0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [likedSlides, setLikedSlides] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  const getCurrentContent = () => {
    const index = showTitle ? currSlide - 1 : currSlide;
    return (index >= 0 && index < channel.contents.length) ? channel.contents[index] : null;
  };  

  const showTitle = channel.showtitle || privateID;
  const mediaType = getMediaInfo(getCurrentContent()).type;

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    if (!audioRef.current)
      return;
    if (isPlaying)
      audioRef.current.play();
    else
      audioRef.current.pause();
    mediaType?.startsWith('video/') || mediaType?.startsWith('audio/') || mediaType?.startsWith('youtube') ? audioRef.current.volume = 0.25 :  audioRef.current.volume = 0.8;
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
    const url = `${baseurl.origin}${baseurl.pathname}?channelid=${channel.uniqueID}&currslide=${privateID ? 0 : currSlide}`;  
    navigator.clipboard.writeText(url)
      .then(() => alert('URL copied to clipboard!'))
      .catch(err => console.error('Failed to copy URL: ', err));
  };

  const handleHeartClick = () => {
    setLikedSlides(prevLikedSlides => 
      prevLikedSlides.includes(currSlide)
        ? prevLikedSlides.filter(index => index !== currSlide)
        : [...prevLikedSlides, currSlide]
    );
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const iconBarStyle = {
    position: 'fixed',
    display: 'flex',
    backgroundColor: 'rgba(50, 50, 50, 0.5)',
    padding: 'clamp(8px, 0.5vh, 20px)',
    borderRadius: 'clamp(10px, 2vh, 20px)',
    zIndex: 1,
    alignItems: 'center',
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

  const buttonStyle = {
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

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle}>&times;</button>
  );

  return (
    <div style={{width: width, display: "flex", flexDirection: "column", ...props.style}}>
      {!isInactive && <div style={{
        ...iconBarStyle, 
        bottom: 'clamp(10px, 2vh, 20px)', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        gap: '25px'
      }}>
        { false && <button onClick={copyUrlToClipboard} style={iconButtonStyle}>
          <FaPaperclip />
        </button> }
        { (privateID || channel.allowsubmissions) && <button onClick={() => setIsUploadModalOpen(true)} style={iconButtonStyle}>
          <FaPlus />
        </button> }
        <button onClick={togglePlayPause} style={iconButtonStyle}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={toggleFullScreen} style={iconButtonStyle}>
          <FaExpandArrowsAlt />
        </button>
        <button 
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
          touchEnabled={true} 
          dragEnabled={true} 
          infinite 
          currentSlide={currSlide}
          style={{isolation: 'auto !important'}}
        >
          <SlideTracker setCurrSlide={setCurrSlide} />
          <Slider style={{height: height, width: width}}>
            {showTitle && (
              <Slide style={{height: height, width: width}}>
                <div style={{position: 'relative', height: '100%', width: '100%', backgroundColor: channel.background_color}}>
                  <FullImage 
                    src={channel.picture?.url ? getMediaURL() + channel.picture?.url : ""} 
                    width={width} 
                    height={height} 
                    index={0}
                    cover
                    autoPlay={isPlaying}
                    interval={channel.interval} 
                  />
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(200,200,200,0.4)',
                    color: 'rgba(255,255,255,0.9)',
                    borderRadius: '10px',
                    padding: '50px',
                    backdropFilter: 'blur(5px)',
                    width: 'max-content',
                    maxWidth: '80%',
                    textAlign: 'center',
                    overflowWrap: 'break-word',
                    wordWrap: 'break-word',
                    hyphens: 'auto',
                  }}>
                    <div style={{
                      fontSize: 'clamp(24px, 4vh, 48px)',
                      lineHeight: '1.1',
                      fontWeight: 'bold'
                    }}>
                      {channel.name}
                    </div>
                    <div style={{
                      fontSize: 'clamp(18px, 2vh, 32px)',
                      lineHeight: '1.2',
                      marginTop: '10px',
                    }}>
                      {channel.description}
                    </div>
                  </div>
                </div>
              </Slide> 
            )}
            {channel.contents && channel.contents.map((contentItem, index) => {
              index = showTitle ? index + 1 : index;
              return (
                <Slide style={{height: height, width: width}} key={index} index={index}>
                  <Content 
                    key={contentItem.id} 
                    contentItem={contentItem}
                    width={width} 
                    height={height} 
                    autoPlay={isPlaying} 
                    interval={channel.interval} 
                    index={index}
                    cover={contentItem.mediafile?.url?.includes("maustrocard")}
                    caption
                  />
                </Slide>
              );
            })}
          </Slider>
          {channel.contents.length > 0 && (
            privateID ? <>
              <ButtonBack key={1} style={{...buttonStyle, left: '1%'}}><FaChevronLeft /></ButtonBack>
              <ButtonNext key={2} style={{...buttonStyle, right: '1%'}}><FaChevronRight /></ButtonNext>
            </> :
            <>
              <ButtonBack style={{position: 'absolute', top: 0, left: 0, width: '20%', height: '100%', opacity: 0, background: 'transparent', border: 'none', cursor: 'w-resize'}} />
              <ButtonNext style={{position: 'absolute', top: 0, right: 0, width: '20%', height: '100%', opacity: 0, background: 'transparent', border: 'none', cursor: 'e-resize'}} />
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

      {(privateID || jwt) && !isInactive && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10
        }}>
        { showTitle && currSlide === 0 ?
          <ChannelControls channel={channel} privateID={privateID} flex="column" iconSize={24} jwt={jwt} />
          : <ItemControls contentItem={getCurrentContent()} privateID={privateID} flexDirection="column" iconSize={24} jwt={jwt} /> }
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
