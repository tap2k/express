import { use100vh } from 'react-div-100vh';
import Slideshow from "../components/slideshow";
import getChannel from "../hooks/getchannel";


export default ({ channel, currslide, admin }) => {
    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <Slideshow style={{backgroundColor: "black"}} channel={channel} width={width} height={height}startSlide={currslide} privateID={admin} autoPlay />
    );
}

export async function getServerSideProps(ctx) {
    const { channelid, currslide, admin } = ctx.query;

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
  