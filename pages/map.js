import dynamic from "next/dynamic";
import { use100vh } from 'react-div-100vh';
import { getPublicID } from '../hooks/seed';
import Banner from "../components/banner";
import AddMenu from "../components/addmenu";
import getChannel from "../hooks/getchannel";

const Mapper = dynamic(() => import("../components/mapper.js"), { ssr: false });

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
                    isSlideshow
                />
            </div>
            <Mapper style={{width: width, height: height}} channel={channel} itemWidth={250} height={height} privateID={privateID} autoPlay tour />
            <AddMenu channel={channel} privateID={privateID} />
        </>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid } = ctx.query;
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
  