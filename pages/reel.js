import { use100vh } from 'react-div-100vh';
import { getPublicID } from '../hooks/seed';
import Slideshow from "../components/slideshow";
import Banner from "../components/banner";
import getChannel from "../hooks/getchannel";

export default ({ channel, currslide, privateID }) => {

    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <>
            <Banner channel={channel} privateID={privateID} isSlideshow />
            <Slideshow channel={channel} width={width} height={height}startSlide={currslide} privateID={privateID} style={{backgroundColor: 'black'}}/>
        </>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid, currslide } = ctx.query;
    let privateID = null;

    const publicID = getPublicID(channelid);
    if (publicID)
    {
        privateID = channelid;
        channelid = publicID;
    }

    try {
        // TODO: Hack for testing
        const channel = await getChannel({ channelID: channelid, privateID: privateID });
        
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
                currslide : currslide ? currslide : 0,
                privateID: privateID
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
  