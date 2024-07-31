import { use100vh } from 'react-div-100vh';
import Slideshow from "../components/slideshow";
import getChannel from "../hooks/getchannel";
import { getPublicID } from '../hooks/seed';


export default ({ channel, currslide, privateID }) => {
    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <Slideshow style={{backgroundColor: "black"}} channel={channel} width={width} height={height} startSlide={currslide} privateID={privateID} />
    );
}

export async function getServerSideProps(ctx) {
    const { channelid, currslide } = ctx.query;
    
    const publicID = getPublicID(channelid);
    if (!channelid || !publicID)
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };

    try {
        const channel = await getChannel({ channelID: publicID });
        
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
                currslide: currslide ? currslide : 0,
                privateID: channelid
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
  