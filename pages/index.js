/* pages/index.js */

import { use100vh } from 'react-div-100vh';
import getChannel from "../hooks/getchannel";
import Slideshow from "../components/slideshow";
import Prober from "../components/prober";
import ChannelAdder from "../components/channeladder";

export default ({ channel }) => {  

  if (!channel)
    return <ChannelAdder />
    
  if (channel.contents?.length)
  {
    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <Slideshow style={{backgroundColor: "black"}} channel={channel} width={width} height={height} interval={channel.interval} showTitle autoPlay />
    );
  }
  
  return (
    <Prober channelID={channel?.uniqueID} /> 
  );
};

export async function getServerSideProps(ctx) {
  try {
      const channelid = ctx.query?.channelid;
      if (channelid)
      {
        let channel = await getChannel({channelID: channelid});
        return { props: { channel: channel } };
      }
  } catch (err) {
      console.error(err);
  }
  return {
      props: {}
  }
}