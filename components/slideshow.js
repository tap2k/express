/* components/slideshow.js */

import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import '../node_modules/pure-react-carousel/dist/react-carousel.es.css';
import Content from "./content";

export default function Slideshow({ channel, height, width, interval, autoPlay, ...props }) 
{
  if (!channel)
    return;

  return (
    <div style={{width: width, height: height, display: "inline-block", position: "relative"}} {...props}>
      <CarouselProvider isIntrinsicHeight totalSlides={channel.contents.length} touchEnabled={false} dragEnabled={false} infinite isPlaying={interval ? true : false} interval={interval}>
        <Slider style={{height: height, width: width}}>
        {
          channel.contents && channel.contents.map((contentItem, index) => {
            return <Slide style={{height: height, width: width}} key={index} index={index}>
                      <Content key={contentItem.id} contentItem={contentItem} width={width} height={height} autoPlay={autoPlay} index={index} />
              </Slide>
            })
        }
        </Slider>
        { channel.contents.length > 1 ? 
            [ <ButtonBack key={1} style={{position: 'absolute', top: '45%', left:'1%', opacity:'0.5', width: '10%', minWidth: 5, maxWidth: 50, height: 50, border: '1px solid gray'}}><b>&lt;</b></ButtonBack>, 
            <ButtonNext key={2} style={{position: 'absolute', top: '45%', right:'1%', opacity:'0.5', width: '10%', minWidth: 5, maxWidth: 50, height: 50, border: '1px solid gray'}}><b>&gt;</b></ButtonNext> ]
          : "" }
      </CarouselProvider>
      </div>
  );
}
