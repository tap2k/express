import { useState } from 'react';
import nookies from 'nookies';
import dynamic from "next/dynamic";
import { use100vh } from 'react-div-100vh';
import { getPublicID } from '../hooks/seed';
import PageMenu from '../components/pagemenu';
import Banner from "../components/banner";
import AddMenu from "../components/addmenu";
import getChannel from "../hooks/getchannel";
import getTilesets from "../hooks/gettilesets";

const Mapper = dynamic(() => import("../components/mapper.js"), { ssr: false });

export default ({ channel, tilesets, privateID, jwt }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <>
            <div style={{ position: 'absolute', width: width}}>
                <PageMenu loggedIn={privateID || jwt} /> 
                <Banner 
                    channel={channel}
                    privateID={privateID}
                    jwt={jwt}
                    isSlideshow
                />
            </div>
            <Mapper style={{width: width, height: height}} channel={channel} itemWidth={250} isPlaying={isPlaying} privateID={privateID} tilesets={tilesets} jwt={jwt} tour />
            <AddMenu channel={channel} isPlaying={isPlaying} setIsPlaying={setIsPlaying} privateID={privateID} jwt={jwt} />
        </>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid, edit } = ctx.query;
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
        const channel = await getChannel({ channelID: channelid, privateID: privateID, jwt: jwt, edit: edit });
        
        if (!channel) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        const tilesets = await getTilesets();

        return { 
            props: { 
                channel: channel,
                privateID: privateID,
                jwt: channel.canedit && edit ? jwt : null,
                tilesets: tilesets
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
  