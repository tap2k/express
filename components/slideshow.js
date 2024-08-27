import { useRouter } from 'next/router';
import { useState, useEffect, useContext, useRef } from "react";
import { CarouselProvider, CarouselContext, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import '../node_modules/pure-react-carousel/dist/react-carousel.es.css';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { FaHeart, FaTrash, FaArrowLeft, FaArrowRight, FaExpandArrowsAlt, FaPlus, FaEdit, FaCheck, FaTimes, FaPaperclip, FaPlay, FaPause, FaDownload, FaChevronLeft, FaChevronRight, FaMusic, FaImage } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import getMediaURL from "../hooks/getmediaurl";
import updateSubmission from '../hooks/updatesubmission';
import deleteSubmission from '../hooks/deletesubmission';
import updateChannel from '../hooks/updatechannel';
import deleteChannel from '../hooks/deletechannel';
import sendEmailLinks from '../hooks/sendemaillinks';
import { imageOptions, audioOptions } from './fileoptions';
import { StyledInput } from './recorderstyles';
import Uploader from "./uploader";
import FullImage from "./fullimage";
import Content, { getMediaInfo } from "./content";
import ContentEditor from "./contenteditor";
import MediaPicker from "./mediapicker";
import Caption from "./caption";

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
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [deletePic, setDeletePic] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [deleteAudio, setDeleteAudio] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [likedSlides, setLikedSlides] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const titleRef = useRef();
  const subtitleRef = useRef();
  const emailRef = useRef();
  
  const showTitle = channel.showtitle || privateID;

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    setUploading(false);
    setDeletePic(false);
    setSelectedImage(null);
    setSelectedAudio(null);
    setUploadedFiles([]);
    setProgress(0);
}, [isImageModalOpen, isAudioModalOpen, isChannelModalOpen, isContentModalOpen]);

  useEffect(() => {
    if (!audioRef.current)
      return;
    if (isPlaying)
      audioRef.current.play();
    else
      audioRef.current.pause();
    const mediaType = getMediaInfo(getCurrentContent()).type;
    mediaType?.startsWith('video/') || mediaType?.startsWith('audio/') || mediaType?.startsWith('youtube') ? audioRef.current.volume = 0.25 :  audioRef.current.volume = 0.8;
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
  
  const handlePublish = async () => {
    const contentToPublish = getCurrentContent();
    await updateSubmission({contentID: contentToPublish.id, published: contentToPublish.publishedAt ? false : true});
    await router.replace(router.asPath);
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

  const handleSaveChannel = async ( ) => {
    setUploading(true);
    const myFormData = new FormData();
    uploadedFiles.forEach(file => myFormData.append(file.name, file, file.name));
    await updateChannel({myFormData: myFormData, name: titleRef.current?.value, description: subtitleRef.current?.value, uniqueID: channel.uniqueID, email: emailRef.current?.value, picturefile: selectedImage, audiofile: selectedAudio, deletePic: deletePic, deleteAudio: deleteAudio, setProgress: setProgress});
    if (emailRef.current?.value != channel.email) {
      await sendEmailLinks({channelID: channel.uniqueID, privateID: privateID, channelName: channel.name, email: emailRef.current?.value});
    }
    setIsChannelModalOpen(false);
    setIsAudioModalOpen(false);
    setIsImageModalOpen(false);
    await router.replace(router.asPath);
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

  const iconBarStyle = {
    position: 'fixed',
    display: 'flex',
    backgroundColor: 'rgba(50, 50, 50, 0.5)',
    padding: 'clamp(8px, 0.5vh, 20px)',
    borderRadius: 'clamp(10px, 2vh, 20px)',
    zIndex: 90,
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
    <div style={{width: width, display: "flex", flexDirection: "column"}} {...props}>
      { privateID && 
        <div style={{
          ...iconBarStyle, 
          flexDirection: 'column', 
          top: '3px', 
          right: '20px'
        }}>
          <button 
            onClick={() => {
              if (showTitle && currSlide === 0) {
                if (isPlaying) togglePlayPause();
                setIsChannelModalOpen(true);
              } else {
                setIsContentModalOpen(true);
              }
            }} 
            style={iconButtonStyle}
          >
            <FaEdit />
          </button>
          <button onClick={showTitle && currSlide === 0 ? handleDeleteChannel : handleDelete} style={iconButtonStyle}>
            <FaTrash />
          </button>
          {!(showTitle && currSlide === 0) ? (
            <>
              <button onClick={() => moveSlide(-1)} style={iconButtonStyle}>
                <FaArrowLeft />
              </button>
              <button onClick={() => moveSlide(1)} style={iconButtonStyle}>
                <FaArrowRight />
              </button>
              <button onClick={handlePublish} style={iconButtonStyle}>
                { getCurrentContent().publishedAt ? <FaTimes /> : <FaCheck /> }
              </button>
            </>
          ) : (
            <>
            <button onClick={() => setIsImageModalOpen(true)} style={iconButtonStyle}>
              <FaImage />
            </button>
            <button onClick={() => setIsAudioModalOpen(true)} style={iconButtonStyle}>
              <FaMusic />
            </button>
          </>
          )
        }
        </div>
      }
      
      <div style={{
        ...iconBarStyle, 
        bottom: 'clamp(10px, 2vh, 20px)', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        gap: '25px'
      }}>
        { false && <button onClick={copyUrlToClipboard} style={iconButtonStyle}>
          <FaPaperclip />
        </button> }
        <button onClick={() => setIsUploadModalOpen(true)} style={iconButtonStyle}>
          <FaPlus />
        </button>
        <button onClick={togglePlayPause} style={iconButtonStyle}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={toggleFullScreen} style={iconButtonStyle}>
          <FaExpandArrowsAlt />
        </button>
        {/*
          <button 
            onClick={handleHeartClick} 
            style={{...iconButtonStyle, color: likedSlides.includes(currSlide) ? 'red' : 'white'}}
          >
            <FaHeart />
          </button>
        */}
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
      </div>

      <div style={{width: width, height: height, position: "relative", isolation: 'auto'}}>
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
                    size="big"
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
                    caption
                  />
                </Slide>
              );
            })}
          </Slider>
          {channel.contents.length > 0 && (
            <>
              <ButtonBack key={1} style={{...buttonStyle, left: '1%'}}><FaChevronLeft /></ButtonBack>
              <ButtonNext key={2} style={{...buttonStyle, right: '1%'}}><FaChevronRight /></ButtonNext>
            </>
          )}
        </CarouselProvider>
      </div>

      <ContentEditor contentItem={getCurrentContent()} isModalOpen={isContentModalOpen} setIsModalOpen={setIsContentModalOpen} />

      {channel.audiofile?.url && (
        <audio
          ref={audioRef}
          src={getMediaURL() + channel.audiofile.url}
          loop
          style={{ display: 'none' }}
        />
      )}

      <Modal isOpen={isChannelModalOpen} toggle={() => setIsChannelModalOpen(false)}>
        <ModalHeader close={closeBtn(() => setIsChannelModalOpen(false))}></ModalHeader>
        <ModalBody>
          <StyledInput
          type="text"
          innerRef={titleRef}
          placeholder="Enter your title here"
          defaultValue={channel.name || ""}
          />
          <StyledInput
            type="email"
            innerRef={emailRef}
            placeholder="Update your email here"
            defaultValue={channel.email || ""}
          />
          <Button
            onClick={handleSaveChannel}
            style={buttonStyle}
          >
            {'Update Reel'}
          </Button>
        </ModalBody>
      </Modal>

      <Modal isOpen={isAudioModalOpen} toggle={() => {setIsAudioModalOpen(false); setDeleteAudio(false)}}>
        <ModalHeader close={closeBtn(() => setIsAudioModalOpen(false))}></ModalHeader>
        <ModalBody>
          <MediaPicker mediaUrl={channel.audiofile?.url} progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} selectedMedia={selectedAudio} setSelectedMedia={setSelectedAudio} deleteMedia={deleteAudio} setDeleteMedia={setDeleteAudio} accept="audio/*" gallery="audio" />
          <Button
            onClick={handleSaveChannel}
            disabled={uploading || (!uploadedFiles.length && !deleteAudio && !selectedAudio)}
            block
            color="success"
            style={{marginTop: '10px'}}
          >
            {'Update Reel'}
          </Button>
        </ModalBody>
      </Modal>

      <Modal isOpen={isImageModalOpen} toggle={() => {setIsImageModalOpen(false); setDeletePic(false)}}>
        <ModalHeader close={closeBtn(() => setIsImageModalOpen(false))}></ModalHeader>
        <ModalBody>
          <MediaPicker mediaUrl={channel.picture?.url} progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} selectedMedia={selectedImage} setSelectedMedia={setSelectedImage}  selectedColor={selectedColor} setSelectedColor={setSelectedColor} deleteMedia={deletePic} setDeleteMedia={setDeletePic} uploading={uploading} setUploading={setUploading} accept="image/*" gallery="image" color />
          <Button
            onClick={handleSaveChannel}
            disabled={uploading || (!uploadedFiles.length && !deletePic && !selectedImage)}
            block
            color="success"
            style={{marginTop: '10px'}}
          >
            {'Update Reel'}
          </Button>
        </ModalBody>
      </Modal>

      <Modal isOpen={isUploadModalOpen} toggle={() => setIsUploadModalOpen(false)}>
        <ModalHeader toggle={() => setIsUploadModalOpen(false)} close={closeBtn} />
        <ModalBody>
          <Uploader
              channelID={channel.uniqueID}
              toggle={() => setIsUploadModalOpen(false)}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}
