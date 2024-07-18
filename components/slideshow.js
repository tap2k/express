/* components/slideshow.js */

import Link from 'next/link';
import { useState, useEffect } from "react";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import '../node_modules/pure-react-carousel/dist/react-carousel.es.css';
import Content from "./content";

export default function Slideshow({ channel, height, width, interval, showTitle, autoPlay, ...props }) 
{
  if (!channel)
    return;

  const [isFullScreen, setIsFullScreen] = useState(false);

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
    bottom: '20px',
    zIndex: 1000,
    fontSize: 'xx-large',
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    lineHeight: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    border: 'none',
    color: 'white', // not needed with reactstrap
  };

  return (
    <div style={{width: width, height: height, display: "inline-block", position: "relative"}} {...props}>
      <CarouselProvider isIntrinsicHeight totalSlides={showTitle ? channel.contents.length + 1 : channel.contents.length} touchEnabled={false} dragEnabled={false} infinite isPlaying={interval ? true : false} interval={interval} >
        <Link href={"/upload?channelid="+channel.uniqueID} passHref>
          <button style={{...buttonStyle, left: 'calc(50% - 70px)'}}>
            +
          </button>
        </Link>
        <button onClick={toggleFullScreen} style={{...buttonStyle, left: 'calc(50% + 0px)'}}>
          ⛶
        </button>
        <Slider style={{height: height, width: width}}>
        { showTitle ? 
          <Slide style={{height: height, width: width}}>
          <div style={{filter: 'invert(100%) grayscale(100%)', mixBlendMode: 'difference', whiteSpace: 'pre-wrap', width: '100%', position: 'absolute', top: '50%', transform: "translate(0, -50%)", maxHeight: "80%", overflowY: "auto", padding: '0 15%', boxSizing: 'border-box', textAlign: 'center'}}>
            <b style={{fontSize: "xxx-large"}}>{channel.name}</b>
          </div>
          </Slide> : "" }
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
  );
}
