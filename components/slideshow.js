import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect, useContext, useRef } from "react";
import { CarouselProvider, CarouselContext, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import '../node_modules/pure-react-carousel/dist/react-carousel.es.css';
import { Modal, ModalHeader, ModalBody, Button, Input } from 'reactstrap';
import { FaHeart, FaTrash, FaArrowLeft, FaArrowRight, FaExpandArrowsAlt, FaPlus, FaEdit, FaCheck, FaPaperclip, FaPlay, FaPause, FaDownload } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import getMediaURL from "../hooks/getmediaurl";
import updateSubmission from '../hooks/updatesubmission';
import deleteSubmission from '../hooks/deletesubmission';
import updateChannel from '../hooks/updatechannel';
import deleteChannel from '../hooks/deletechannel';
import sendEmailLinks from '../hooks/sendemaillinks';
import FullImage from "./fullimage";
import Content, { getMediaInfo } from "./content";
import Caption from "./caption";
import ContentEditor from "./contenteditor";
import ChannelEditor from './channeleditor';

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
    console.log("Download failed: " + err);
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

export default function Slideshow({ channel, height, width, startSlide, autoPlay, privateID, ...props }) 
{
  if (!channel) return;

  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currSlide, setCurrSlide] = useState(parseInt(startSlide) || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [likedSlides, setLikedSlides] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  const showTitle = channel.showtitle || privateID;

  const [claimedSlides, setClaimedSlides] = useState(() => {
    if (!channel || !channel.contents) return [];
  
    return channel.contents.reduce((acc, content, index) => {
      if (!content.publishedAt) {
        const slideIndex = showTitle ? index + 1 : index;
        acc.push(slideIndex);
      }
      return acc;
    }, []);
  });

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
    const mediaType = getMediaInfo(getCurrentContent()).type;
    mediaType?.startsWith('video/') || mediaType?.startsWith('audio/') || mediaType?.startsWith('youtube') ? audioRef.current.volume = 0.2 :  audioRef.current.volume = 0.8;
  }, [currSlide, isPlaying]);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  const getCurrentContent = () => {
    const index = showTitle ? currSlide - 1 : currSlide;
    return (index >= 0 && index < channel.contents.length) ? channel.contents[index] : null;
  };  

  const copyUrlToClipboard = () => {
    const baseurl = new URL(window.location.href);
    const url = `${baseurl.origin}${baseurl.pathname}?channelid=${channel.uniqueID}&currslide=${currSlide}`;  
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
  
  const handleClaim = async () => {
    const contentToClaim = getCurrentContent();
    if (contentToClaim) {
      const publishedStatus = !claimedSlides.includes(currSlide);
      confirmAlert({
        title: `Confirm ${publishedStatus ? 'claim' : 'unclaim'}`,
        message: `Are you sure you want to ${publishedStatus ? 'claim' : 'unclaim'} this item?`,
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              await updateSubmission({contentID: contentToClaim.id, published: !publishedStatus});
              setClaimedSlides(prevClaimedSlides => 
                publishedStatus
                  ? [...prevClaimedSlides, currSlide]
                  : prevClaimedSlides.filter(index => index !== currSlide)
              );
            }
          },
          {
            label: 'No',
            onClick: () => {}
          }
        ]
      });
    }
  };

  const handleDelete = () => {
    confirmAlert({
      title: `Delete item?`,
      message: `Are you sure you want to delete this item?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            const contentToDelete = getCurrentContent();
            if (contentToDelete) {
              await deleteSubmission({contentID: contentToDelete.id});
              const newQuery = { 
                ...router.query, 
                currslide: Math.min(currSlide, showTitle ? channel.contents.length : channel.contents.length - 1)
              };
              await router.replace({
                pathname: router.pathname,
                query: newQuery,
              });
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleDeleteChannel = () => {
    confirmAlert({
      title: 'Delete reel?',
      message: 'Are you sure you want to delete this reel?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await deleteChannel(channel.uniqueID);
            await router.push('/');
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleSaveChannel = async (data) => {
    await updateChannel(data);
    if (data.email && data.email != channel.email) {
      await sendEmailLinks({channelID: channel.uniqueID, privateID: privateID, channelName: channel.name, email: data.email});
    }
    setIsChannelModalOpen(false);
    const newQuery = { ...router.query, currslide: 0 };
    await router.replace({ pathname: router.pathname, query: newQuery });
  };

  const moveSlide = async (increment) => {
    const contentIndex = showTitle ? currSlide - 1 : currSlide;
    if ((contentIndex + increment) < 0 || (contentIndex + increment) >= channel.contents.length) return;
    
    const contentToMove = channel.contents[contentIndex];
    if (contentToMove) {
      await updateSubmission({contentID: contentToMove.id, order: channel.contents[contentIndex + increment].order});
      const newQuery = { 
        ...router.query, 
        currslide: Math.min(currSlide + increment, showTitle ? channel.contents.length : channel.contents.length - 1)
      };
      setCurrSlide(currSlide + increment);
      await router.replace({ pathname: router.pathname, query: newQuery });
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle}>&times;</button>
  );

  const iconBarStyle = {
    position: 'fixed',
    display: 'flex',
    backgroundColor: 'rgba(50, 50, 50, 0.5)',
    padding: 'clamp(8px, 0.5vh, 20px)',
    borderRadius: 'clamp(10px, 2vh, 20px)',
    zIndex: 1000,
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
    fontSize: 'clamp(20px, 2.5vh, 32px)',
  };

  return (
    <div style={{width: width, display: "flex", flexDirection: "column"}} {...props}>
      { privateID && 
        <div style={{
          ...iconBarStyle, 
          flexDirection: 'column', 
          top: '15px', 
          right: '15px'
        }}>
          <button 
            onClick={() => {
              if (showTitle && currSlide === 0) {
                if (isPlaying) togglePlayPause();
                setIsChannelModalOpen(true);
              } else {
                setIsModalOpen(true);
              }
            }} 
            style={iconButtonStyle}
          >
            <FaEdit />
          </button>
          <button onClick={showTitle && currSlide === 0 ? handleDeleteChannel : handleDelete} style={iconButtonStyle}>
            <FaTrash />
          </button>
          {!(showTitle && currSlide === 0) && (
            <>
              <button onClick={() => moveSlide(-1)} style={iconButtonStyle}>
                <FaArrowLeft />
              </button>
              <button onClick={() => moveSlide(1)} style={iconButtonStyle}>
                <FaArrowRight />
              </button>
            </>
          )}
        </div>
      }
      
      <div style={{
        ...iconBarStyle, 
        bottom: 'clamp(10px, 2vh, 20px)', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        gap: 'clamp(10px, 2vw, 20px)'
      }}>
        <button onClick={copyUrlToClipboard} style={iconButtonStyle}>
          <FaPaperclip />
        </button>
        <button onClick={toggleFullScreen} style={iconButtonStyle}>
          <FaExpandArrowsAlt />
        </button>
        <Link href={`/upload?channelid=${channel.uniqueID}`} rel="noopener noreferrer" target="_blank">
          <button style={iconButtonStyle}>
            <FaPlus />
          </button>
        </Link>
        <button onClick={togglePlayPause} style={iconButtonStyle}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        {/*getCurrentContent()?.ext_url ? (
          <button 
            onClick={handleClaim} 
            style={{...iconButtonStyle, color: claimedSlides.includes(currSlide) ? 'green' : 'white'}}
          >
            <FaCheck />
          </button>
        ) : (
          <button 
            onClick={handleHeartClick} 
            style={{...iconButtonStyle, color: likedSlides.includes(currSlide) ? 'red' : 'white'}}
          >
            <FaHeart />
          </button>
        )*/}
        <button 
          onClick={async () => {
            if (showTitle && currSlide == 0) {
              console.log("DOWNLOAD");
              return;
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
      </div>

      <div style={{width: width, height: height, position: "relative"}}>
        <CarouselProvider 
          isIntrinsicHeight 
          totalSlides={showTitle ? channel.contents.length + 1 : channel.contents.length} 
          touchEnabled={false} 
          dragEnabled={false} 
          infinite 
          currentSlide={currSlide}
        >
          <SlideTracker setCurrSlide={setCurrSlide} />
          <Slider style={{height: height, width: width}}>
            {showTitle && (
              <Slide style={{height: height, width: width}}>
                <div style={{position: 'relative', height: '100%', width: '100%'}}>
                  <FullImage 
                    src={channel.picture?.url ? getMediaURL() + channel.picture?.url : ""} 
                    width={width} 
                    height={height} 
                    index={0}
                    cover
                    autoPlay={isPlaying}
                    interval={channel.interval} 
                  />
                  <Caption 
                    title={channel.name}
                    subtitle={channel.description}
                    textAlignment="center"
                  />
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
                  />
                  <Caption 
                      title={contentItem.description}
                      url={contentItem.ext_url} 
                      textAlignment={contentItem.textalignment} 
                  />
                </Slide>
              );
            })}
          </Slider>
          {channel.contents.length > 0 && (
            <>
              <ButtonBack style={{position: 'absolute', top: 0, left: 0, width: '20%', height: '100%', opacity: 0, background: 'transparent', border: 'none', cursor: 'w-resize'}} />
              <ButtonNext style={{position: 'absolute', top: 0, right: 0, width: '20%', height: '100%', opacity: 0, background: 'transparent', border: 'none', cursor: 'e-resize'}} />
            </>
          )}
        </CarouselProvider>
      </div>


      <Modal isOpen={isChannelModalOpen} toggle={() => setIsChannelModalOpen(false)}>
        <ModalHeader close={closeBtn(() => setIsChannelModalOpen(false))}></ModalHeader>
        <ModalBody>
          <ChannelEditor
            initialData={channel}
            onSubmit={handleSaveChannel}
          />
        </ModalBody>
      </Modal>

      <ContentEditor contentItem={getCurrentContent()} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} slideshow />

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
