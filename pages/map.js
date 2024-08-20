import dynamic from "next/dynamic";
import { use100vh } from 'react-div-100vh';
import PageMenu from "../components/pagemenu";
import MakeButton from "../components/makebutton";
import getChannel from "../hooks/getchannel";

const Mapper = dynamic(() => import("../components/mapper.js"), { ssr: false });

const menuStyle = {
    position: 'absolute',
    top: '15px',
    left: '40px',
    zIndex: 1000
  };

const makeStyle = {
    position: 'absolute',
    top: '25px',
    right: '20px',
    zIndex: 1000
  };

export default ({ channel, admin }) => {
    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <>
            <PageMenu style={menuStyle} />
            {!admin && <MakeButton style={makeStyle} />}
            <Mapper style={{width: width, height: height}} channel={channel} itemWidth={250} itemHeight={250} height={height} privateID={admin} autoPlay tour />
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { channelid, admin } = ctx.query;

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
  