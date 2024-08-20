import { use100vh } from 'react-div-100vh';
import { getPublicID } from '../hooks/seed';
import Slideshow from "../components/slideshow";
import PageMenu from "../components/pagemenu";
import MakeButton from "../components/makebutton";
import getChannel from "../hooks/getchannel";

export default ({ channel, currslide, admin }) => {

    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <>
            <PageMenu />
            { !admin && <MakeButton /> }
            <Slideshow style={{backgroundColor: "black"}} channel={channel} width={width} height={height}startSlide={currslide} privateID={admin} autoPlay />
        </>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid, currslide, admin } = ctx.query;
    const publicID = getPublicID(channelid);
    if (publicID)
    {
        channelid = publicID;
        admin = true;
    }

    try {
        // TODO: Hack for testing
        const channel = await getChannel({ channelID: channelid, privateID: admin });
        
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
                admin : admin ? true : false
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
  