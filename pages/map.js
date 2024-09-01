import nookies from 'nookies';
import dynamic from "next/dynamic";
import { use100vh } from 'react-div-100vh';
import { getPublicID } from '../hooks/seed';
import PageMenu from '../components/pagemenu';
import Banner from "../components/banner";
import AddMenu from "../components/addmenu";
import getChannel from "../hooks/getchannel";

const Mapper = dynamic(() => import("../components/mapper.js"), { ssr: false });

export default ({ channel, privateID, jwt }) => {
    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <>
            <div style={{ position: 'absolute', width: width}}>
                <PageMenu />
                <Banner 
                    channel={channel}
                    privateID={privateID}
                    jwt={jwt}
                    isSlideshow
                />
            </div>
            <Mapper style={{width: width, height: height}} channel={channel} itemWidth={250} height={height} privateID={privateID} jwt={jwt} autoPlay tour />
            <AddMenu channel={channel} privateID={privateID} jwt={jwt} />
        </>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid } = ctx.query;
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

        return { 
            props: { 
                channel: channel,
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
  