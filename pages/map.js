import dynamic from "next/dynamic";
import { use100vh } from 'react-div-100vh';
import { getPublicID } from '../hooks/seed';
import PageMenu from "../components/pagemenu";
import MakeButton from "../components/makebutton";
import AddButton from "../components/addbutton";
import getChannel from "../hooks/getchannel";

const Mapper = dynamic(() => import("../components/mapper.js"), { ssr: false });

const makeStyle = {
    position: 'absolute',
    top: '35px',
    right: '20px',
    zIndex: 1000
  };

export default ({ channel, admin }) => {
    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <>
            <PageMenu />
            {!admin && <MakeButton style={makeStyle} />}
            <Mapper style={{width: width, height: height}} channel={channel} itemWidth={250} height={height} privateID={admin} autoPlay tour />
            <AddButton channelID={channel.uniqueID}/>

        </>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid, admin } = ctx.query;
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
  