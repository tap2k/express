/* pages/index.js */

import { use100vh } from 'react-div-100vh';
import getChannel from "../hooks/getchannel";
import Slideshow from "../components/slideshow";
import ChannelAdder from "../components/channeladder";

export default ({ channel, currslide }) => {  

  if (!channel)
    return <ChannelAdder />
    
  const width = "100vw";
  const height = use100vh();
  //const height = "100vh";

  return (
      <Slideshow style={{backgroundColor: "black"}} channel={channel} width={width} height={height} interval={channel.interval} startSlide={parseInt(currslide)} showTitle autoPlay />
  );
};

export async function getServerSideProps(ctx) {
  const { channelid, currslide } = ctx.query;

  try {

    if (!channelid) {
        return {
            props: { } 
        };
    }

    const channel = await getChannel({ channelID: channelid });

    if (!channel) {
        return {
            props: { } 
        };
    }
    
    return { 
        props: { 
            channel: channel, 
            currslide: currslide ? currslide : 0
        } 
    };
  } catch (err) {
      console.error(err);
      return {
          redirect: {
              destination: '/',
              permanent: false,
          },
      };
  }
}