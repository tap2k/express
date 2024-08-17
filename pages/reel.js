import { use100vh } from 'react-div-100vh';
import Slideshow from "../components/slideshow";
import MakeButton from "../components/makebutton";
import getChannel from "../hooks/getchannel";

const makeStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 1000
  };

export default ({ channel, currslide, admin }) => {
    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <>
            <Slideshow style={{backgroundColor: "black"}} channel={channel} width={width} height={height}startSlide={currslide} privateID={admin} autoPlay />
            { !admin && <MakeButton style={makeStyle} /> }
        </>
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
  