/* pages/index.js */

import { use100vh } from 'react-div-100vh';
import getChannel from "../hooks/getchannel";
import Slideshow from "../components/slideshow";

export default ( { channel }  ) => {
    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <Slideshow style={{backgroundColor: "black"}} channel={channel} width={width} height={height} interval={channel.interval} autoPlay />
    );
}

export async function getServerSideProps(ctx) {
    const channelid = ctx.query.channelid ? ctx.query.channelid : "rx7dzpg";
    try {
        let channel = await getChannel({channelID: channelid});
        return { props: { channel: channel } };
    } catch (err) {
        console.error(err);
    }
    return {
        props: {}
    }
}
  