/* components/slideshow.js */

import Link from 'next/link';
import { Button } from 'reactstrap';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import '../node_modules/pure-react-carousel/dist/react-carousel.es.css';
import Content from "./content";

export default function Slideshow({ channel, height, width, interval, showTitle, autoPlay, ...props }) 
{
  if (!channel)
    return;

  showTitle = channel.name && showTitle;

  return (
    <div style={{width: width, height: height, display: "inline-block", position: "relative"}} {...props}>
      <CarouselProvider isIntrinsicHeight totalSlides={showTitle ? channel.contents.length + 1 : channel.contents.length} touchEnabled={false} dragEnabled={false} infinite isPlaying={interval ? true : false} interval={interval} >
        <Link href={"/upload?channelid="+channel.uniqueID} passHref>
          <Button color="primary" style={{position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, fontSize: 'xx-large', width: 50, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, lineHeight: 1}}>
              +
          </Button>
        </Link>
        <Slider style={{height: height, width: width}}>
        { showTitle ? 
          <Slide style={{height: height, width: width}}>
          <div style={{filter: 'invert(100%) grayscale(100%)', mixBlendMode: 'difference', whiteSpace: 'pre-wrap', width: '100%', position: 'absolute', top: '50%', transform: "translate(0, -50%)", maxHeight: "80%", overflowY: "auto", padding: '0 15%', boxSizing: 'border-box', textAlign: 'center'}}>
            <p>
              <b style={{fontSize: "xxx-large"}}>{channel.name}</b><br/>
            </p>
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
            [ <ButtonBack key={1} style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)',left:'1%', opacity:'0.5', width: '10%', minWidth: 5, maxWidth: 50, height: 50, border: '1px solid gray'}}><b>&lt;</b></ButtonBack>, 
            <ButtonNext key={2} style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)',right:'1%', opacity:'0.5', width: '10%', minWidth: 5, maxWidth: 50, height: 50, border: '1px solid gray'}}><b>&gt;</b></ButtonNext> ]
          : "" }
      </CarouselProvider>
      </div>
  );
}
