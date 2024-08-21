import dynamic from "next/dynamic";
import { use100vh } from 'react-div-100vh';
import { getPublicID } from '../hooks/seed';
import Banner from "../components/banner";
import AddButton from "../components/addbutton";
import getChannel from "../hooks/getchannel";

const Mapper = dynamic(() => import("../components/mapper.js"), { ssr: false });

const makeStyle = {
    position: 'absolute',
    top: '35px',
    right: '20px',
    zIndex: 1000
  };

export default ({ channel, privateID }) => {
    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <>
            <div style={{ position: 'absolute', width: width}}>
                <Banner 
                    channel={channel}
                    privateID={privateID}
                />
            </div>
            <Mapper style={{width: width, height: height}} channel={channel} itemWidth={250} height={height} privateID={privateID} autoPlay tour />
            <AddButton channel={channel}/>
        </>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid, admin } = ctx.query;
    let privateID = null;
    if (!admin)
        admin = false;

    const publicID = getPublicID(channelid);
    if (publicID)
    {
        privateID = channelid;
        channelid = publicID;
    }

    try {
        // TODO: Hack for testing
        const channel = await getChannel({ channelID: channelid, privateID: privateID ? privateID : admin });
        
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
                privateID: privateID ? privateID : admin
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
  