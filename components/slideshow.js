import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect, useContext, useRef } from "react";
import { CarouselProvider, CarouselContext, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import '../node_modules/pure-react-carousel/dist/react-carousel.es.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FaHeart, FaTrash, FaArrowLeft, FaArrowRight, FaExpandArrowsAlt, FaPlus, FaEdit, FaCheck, FaPaperclip, FaPlay, FaPause } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Content, { getMediaInfo } from "./content";
import FullImage from "./fullimage";
import getMediaURL from "../hooks/getmediaurl";
import updateSubmission from '../hooks/updatesubmission';
import deleteSubmission from '../hooks/deletesubmission';
import updateChannel from '../hooks/updatechannel';
import deleteChannel from '../hooks/deletechannel';

const SlideTracker = ({ setCurrSlide }) => {
  const carouselContext = useContext(CarouselContext);

  useEffect(() => {
    const onChange = () => {
      setCurrSlide(carouselContext.state.currentSlide);
    };
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext, setCurrSlide]);

  return null;
};

export default function Slideshow({ channel, height, width, interval, startSlide, showTitle, autoPlay, admin, ...props }) 
{
  if (!channel)
    return;

  const router = useRouter();
  const descriptionRef = useRef(null);
  const extUrlRef = useRef(null);
  const channelNameRef = useRef(null);
  const channelDescRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currSlide, setCurrSlide] = useState(parseInt(startSlide) || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [likedSlides, setLikedSlides] = useState([]);
  const [audioVolume, setAudioVolume] = useState(0.8);
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const audioRef = useRef(null);
  
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
    if (!channel.contents) return;

    const currentContent = getCurrentContent();
    if (!currentContent) return;

    const mediaInfo = getMediaInfo(currentContent);
    if (mediaInfo.mimetype.startsWith('video/') || mediaInfo.mimetype.startsWith('audio/')) {
      setAudioVolume(0.2);
    } else {
      setAudioVolume(0.8);
    }
  }, [currSlide, channel.contents]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
        document.documentElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  }

  showTitle = channel.name && showTitle;

  const buttonStyle = {
    position: 'absolute',
    zIndex: 1000,
    fontSize: 'xx-large',
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const getCurrentContent = () => {
    const index = showTitle ? currSlide - 1 : currSlide;
    return channel.contents[index];
  };  

  const copyUrlToClipboard = () => {
    const baseurl = new URL(window.location.href);
    const url = `${baseurl.origin}${baseurl.pathname}?channelid=${channel.uniqueID}`;  
  
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };

  const handleHeartClick = () => {
    setLikedSlides(prevLikedSlides => {
      if (prevLikedSlides.includes(currSlide)) {
        return prevLikedSlides.filter(index => index !== currSlide);
      } else {
        return [...prevLikedSlides, currSlide];
      }
    });
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
                
                setClaimedSlides(prevClaimedSlides => {
                  if (publishedStatus) {
                    return [...prevClaimedSlides, currSlide];
                  } else {
                    return prevClaimedSlides.filter(index => index !== currSlide);
                  }
                });
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
      title: `Confirm delete`,
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
      title: 'Confirm deletion',
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

  const handleSave = async () => {
    const contentToEdit = getCurrentContent();
    if (contentToEdit)
    {
      await updateSubmission({
        contentID: contentToEdit.id,
        description: descriptionRef.current.value,
        ext_url: extUrlRef.current.value
      });
    }
    setIsModalOpen(false);
    await router.replace(router.asPath);
  };

  const handleChannelSave = async () => {
    await updateChannel({
      channelID: channel.uniqueID,
      name: channelNameRef.current.value,
      description: channelDescRef.current.value
    });
    setIsChannelModalOpen(false);
    const newQuery = { 
      ...router.query, 
      currslide: 0
    };
    await router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      }
    );
  };

  const moveSlide = async (increment) => {
    const contentIndex = showTitle ? currSlide - 1 : currSlide;
    if ((contentIndex + increment) < 0)
      return;
    if ((contentIndex + increment) >= channel.contents.length)
      return;
    const contentToMove = channel.contents[contentIndex];
    if (contentToMove)
    {
      await updateSubmission({contentID: contentToMove.id, order: channel.contents[contentIndex + increment].order});
      const newQuery = { 
        ...router.query, 
        currslide: Math.min(currSlide + increment, showTitle ? channel.contents.length : channel.contents.length - 1)
      };
      // TODO to trigger rerender
      setCurrSlide(currSlide + increment);
      await router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        }
      );
    }
  }

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle}>
      &times;
    </button>
  );

  const iconButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '5px'
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  return (
    <div style={{width: width, display: "flex", flexDirection: "column"}} {...props}>
      { !admin ? "" : 
          <div style={{
            width: '10%', 
            top: 20,
            left: 5,
            position: 'absolute',
            zIndex: 1000
          }}>
            <button onClick={() => showTitle && currSlide === 0 ? setIsChannelModalOpen(true) : setIsModalOpen(true)} style={{...buttonStyle, position: 'static', margin: 5}}>
              <FaEdit size={24}/>
            </button>
            <button onClick={showTitle && currSlide === 0 ? handleDeleteChannel : () => handleDelete()} style={{...buttonStyle, position: 'static', margin: 5}}>
              <FaTrash size={24}/>
            </button>
            { (showTitle & currSlide === 0) || !admin ? "" : <>
            <button onClick={() => {moveSlide(-1)}} style={{...buttonStyle, position: 'static', margin: 5}}>
              <FaArrowLeft size={24}/>
            </button>
            <button onClick={() => {moveSlide(1)}} style={{...buttonStyle, position: 'static', margin: 5}}>
              <FaArrowRight size={24}/>
            </button>
            </> }
          </div>
        }

        <style>
          {`
            @keyframes buttonAnimation {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
            .heart-button:active, .check-button:active {
              animation: buttonAnimation 0.3s ease;
            }
          `}
        </style>
        
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '40px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '10px',
          borderRadius: '20px',
          zIndex: 1000,
          height: 60
        }}>
          <button onClick={copyUrlToClipboard} style={iconButtonStyle}>
            <FaPaperclip size={36} />
          </button>
          <button onClick={toggleFullScreen} style={iconButtonStyle}>
            <FaExpandArrowsAlt size={36} />
          </button>
          <Link href={`/upload?channelid=${channel.uniqueID}`} passHref>
            <button style={iconButtonStyle}>
              <FaPlus size={36} />
            </button>
          </Link>
          {channel.audio?.url && (
            <button onClick={toggleAudio} style={iconButtonStyle}>
              {isAudioPlaying ? <FaPause size={36} /> : <FaPlay size={36} />}
            </button>
          )}
          { getCurrentContent()?.ext_url ? 
            <button 
              onClick={() => handleClaim()} 
              style={{...iconButtonStyle, color: claimedSlides.includes(currSlide) ? 'green' : 'white'}}
              className="check-button"
            >
              <FaCheck size={36} />
            </button>
            : 
            <button 
              onClick={() => handleHeartClick()} 
              style={{...iconButtonStyle, color: likedSlides.includes(currSlide) ? 'red' : 'white'}}
              className="heart-button"
            >
              <FaHeart size={36} />
            </button>
          }
        </div>

      <div style={{width: width, height: height, position: "relative"}}>
        <CarouselProvider 
          isIntrinsicHeight 
          totalSlides={showTitle ? channel.contents.length + 1 : channel.contents.length} 
          touchEnabled={false} 
          dragEnabled={false} 
          infinite 
          isPlaying={interval ? true : false} 
          interval={interval} 
          currentSlide={currSlide}
        >
          <SlideTracker setCurrSlide={setCurrSlide} />
          <Slider style={{height: height, width: width}}>
          { showTitle ? 
            <Slide style={{height: height, width: width}}>
              <FullImage src={channel.picture?.url ? getMediaURL() + channel.picture?.url : ""} width={width} height={height} title={channel.name} subtitle={channel.description} centerVertically />;
            </Slide> : "" 
          }
          {
            channel.contents && channel.contents.map((contentItem, index) => {
              index = showTitle ? index + 1 : index
              return <Slide style={{height: height, width: width}} key={index} index={index}>
                        <Content key={contentItem.id} contentItem={contentItem} width={width} height={height} autoPlay={autoPlay} index={index} />
                    </Slide>
            })
          }
          </Slider>
          { channel.contents.length ? 
              [
                <ButtonBack key={1} style={{position: 'absolute', top: 0, left: 0, width: '20%', height: '100%', opacity: 0, background: 'transparent', border: 'none', cursor: 'w-resize'}} />,
                <ButtonNext key={2} style={{position: 'absolute', top: 0, right: 0, width: '20%', height: '100%', opacity: 0, background: 'transparent', border: 'none', cursor: 'e-resize'}} />
              ]
            : "" }
        </CarouselProvider>
      </div>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
          <ModalHeader close={closeBtn(() => setIsModalOpen(false))}>Edit Content</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  innerRef={descriptionRef}
                  defaultValue={channel.contents[showTitle ? currSlide - 1 : currSlide]?.description || ''}
                />
              </FormGroup>
              <FormGroup>
                <Label for="extUrl">External URL</Label>
                <Input
                  type="text"
                  name="extUrl"
                  id="extUrl"
                  innerRef={extUrlRef}
                  defaultValue={channel.contents[showTitle ? currSlide - 1 : currSlide]?.ext_url || ''}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSave}>Save</Button>
            <Button color="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={isChannelModalOpen} toggle={() => setIsChannelModalOpen(false)}>
          <ModalHeader close={closeBtn(() => setIsChannelModalOpen(false))}>Edit Content</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input
                  type="textarea"
                  name="title"
                  id="title"
                  innerRef={channelNameRef}
                  defaultValue={channel.name}
                />
                <Label for="subtitle">Subtitle</Label>
                <Input
                  type="textarea"
                  name="subtitle"
                  id="subtitle"
                  innerRef={channelDescRef}
                  defaultValue={channel.description}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleChannelSave}>Save</Button>
            <Button color="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>

      {channel.audio?.url && (
        <audio
          ref={audioRef}
          src={getMediaURL() + channel.audio.url}
          autoPlay
          loop
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
}
