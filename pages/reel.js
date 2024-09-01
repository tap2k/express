import { use100vh } from 'react-div-100vh';
import nookies from 'nookies';
import { getPublicID } from '../hooks/seed';
import Slideshow from "../components/slideshow";
import PageMenu from '../components/pagemenu';
import getChannel from "../hooks/getchannel";

export default ({ channel, currslide, privateID, jwt }) => {

    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <>
            <PageMenu />
            <Slideshow channel={channel} width={width} height={height}startSlide={currslide} privateID={privateID} jwt={jwt} style={{backgroundColor: 'black'}}/>
        </>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid, currslide } = ctx.query;
    const cookies = nookies.get(ctx);
    const jwt = cookies?.jwt || null;
    let privateID = null;

    const publicID = getPublicID(channelid);
    if (publicID)
    {
        privateID = channelid;
        channelid = publicID;
    }

    try {
        // TODO: Hack for testing
        const channel = await getChannel({ channelID: channelid, privateID: privateID, jwt: jwt });
        
        if (!channel) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        console.log("CAN EDIT = " + channel.canedit);
        return { 
            props: { 
                channel: channel,
                currslide : currslide ? currslide : 0,
                privateID: privateID,
                jwt: channel.canedit ? jwt : null
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
  