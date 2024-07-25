import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect, useContext } from "react";
import { CarouselProvider, CarouselContext, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import '../node_modules/pure-react-carousel/dist/react-carousel.es.css';
import { FaHeart, FaTrash, FaArrowLeft, FaArrowRight, FaExpandArrowsAlt, FaPlus } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Content from "./content";
import updateSubmission from '../hooks/updatesubmission';

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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currSlide, setCurrSlide] = useState(startSlide || 0);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

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

  const titleStyle = {
    filter: 'invert(100%) grayscale(100%)',
    mixBlendMode: 'difference',
    whiteSpace: 'pre-wrap',
    width: '100%',
    position: 'absolute',
    top: '50%',
    transform: "translate(0, -50%)",
    maxHeight: "80%",
    overflowY: "auto",
    padding: '0 15%',
    textAlign: 'center'
  };

  const handleDelete = () => {
    confirmAlert({
      title: 'Confirm deletion',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            const contentIndex = showTitle ? currSlide - 1 : currSlide;
            const contentToDelete = channel.contents[contentIndex];
            if (contentToDelete) {
              await updateSubmission({contentID: contentToDelete.id, published: false});
              const newQuery = { 
                ...router.query, 
                currslide: Math.min(currSlide, channel.contents.length - 1)
              };
              router.replace({
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

  const moveSlide = async (increment) => {
    const contentIndex = showTitle ? currSlide - 1 : currSlide;
    if ((contentIndex + increment) < 0)
      return;
    if ((contentIndex + increment) >= channel.contents.length)
      return;
    const contentToMove = channel.contents[contentIndex];
    await updateSubmission({contentID: contentToMove.id, order: channel.contents[contentIndex + increment].order});
    const newQuery = { 
      ...router.query, 
      currslide: Math.min(currSlide + increment, channel.contents.length)
    };
    router.replace({
      pathname: router.pathname,
      query: newQuery,
    });
  }

  return (
    <div style={{width: width, height: height, display: "inline-block", position: "relative"}} {...props}>
      <style>
        {`
          @keyframes likeAnimation {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          .heart-checkbox {
            display: none;
          }
          .heart-label {
            cursor: pointer;
            transition: color 0.3s ease;
          }
          .heart-checkbox:checked + .heart-label {
            color: red;
          }
          .heart-label:active {
            animation: likeAnimation 0.3s ease;
          }
        `}
      </style>
      <CarouselProvider 
        isIntrinsicHeight 
        totalSlides={showTitle ? channel.contents.length + 1 : channel.contents.length} 
        touchEnabled={false} 
        dragEnabled={false} 
        infinite 
        isPlaying={interval ? true : false} 
        interval={interval} 
        currentSlide={startSlide}
      >
        <SlideTracker setCurrSlide={setCurrSlide} />
        <button onClick={toggleFullScreen} style={{...buttonStyle, bottom: '20px', left: 'calc(50% - 85px)'}}>
          <FaExpandArrowsAlt size={24} />
        </button>
        <Link href={`/upload?channelid=${channel.uniqueID}`} passHref>
          <button style={{...buttonStyle, bottom: '20px', left: 'calc(50% - 25px)'}}>
            <FaPlus size={24} />
          </button>
        </Link>
        <div style={{...buttonStyle, bottom: '20px', left: 'calc(50% + 35px)'}}>
          <input type="checkbox" id="heart-checkbox" className="heart-checkbox" />
          <label htmlFor="heart-checkbox" className="heart-label">
            <FaHeart size={24} />
          </label>
        </div>
        { (showTitle && currSlide === 0) || !admin? "" : <>
          <button onClick={handleDelete} style={{...buttonStyle, top: '20px', right: '20px'}}>
            <FaTrash size={24}/>
          </button>
          <button onClick={() => {moveSlide(1)}} style={{...buttonStyle, top: '20px', right: '80px'}}>
            <FaArrowRight size={24}/>
          </button>
          <button onClick={() => {moveSlide(-1)}} style={{...buttonStyle, top: '20px', right: '140px'}}>
            <FaArrowLeft size={24}/>
          </button>
        </> }
        <Slider style={{height: height, width: width}}>
        { showTitle ? 
          <Slide style={{height: height, width: width}}>
            <div style={titleStyle}>
              <b style={{fontSize: "xxx-large"}}>{channel.name}</b>
            </div>
          </Slide> : "" }
        {
          channel.contents && channel.contents.map((contentItem, index) => {
            index = showTitle ? index + 1 : index
            return <Slide style={{height: height, width: width}} key={index} index={index}>
                      <Content key={contentItem.id} contentItem={contentItem} width={width} height={height} autoPlay={autoPlay} index={index} setCurrSlide={setCurrSlide} />
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
  );
}
