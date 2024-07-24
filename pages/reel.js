/* pages/reel.js */

import { use100vh } from 'react-div-100vh';
import getChannel from "../hooks/getchannel";
import Slideshow from "../components/slideshow";

export default ({ channel, currslide }) => {
    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <Slideshow style={{backgroundColor: "black"}} channel={channel} width={width} height={height} interval={channel.interval} startSlide={currslide} showTitle autoPlay />
    );
}

export async function getServerSideProps(ctx) {
    const { channelid, currslide } = ctx.query;

    try {
        const channel = await getChannel({ channelID: channelid });
        
        if (!channel) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        return { 
            props: { 
                channel: channel, 
                currslide: currslide ? +currslide : 0
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
  