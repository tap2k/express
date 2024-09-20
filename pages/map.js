import { useState } from 'react';
import nookies from 'nookies';
import dynamic from "next/dynamic";
import { use100vh } from 'react-div-100vh';
import getTags from "../hooks/gettags";
import PageMenu from '../components/pagemenu';
//import Banner from "../components/banner";
import AddMenu from "../components/addmenu";
import getChannel from "../hooks/getchannel";
import getTilesets from "../hooks/gettilesets";

const Mapper = dynamic(() => import("../components/mapper.js"), { ssr: false });

export default ({ channel, tilesets, tags, jwt }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <>
            <div style={{ position: 'absolute', width: width}}>
                <PageMenu loggedIn={jwt} /> 
                {/*<Banner 
                    channel={channel}
                    foregroundColor={channel.foreground_color}
                    jwt={jwt}
                />*/}
            </div>
            <Mapper style={{width: width, height: height}} channel={channel} itemWidth={250} isPlaying={isPlaying} tilesets={tilesets} tags={tags} jwt={jwt} tour legend />
            <AddMenu channel={channel} isPlaying={isPlaying} setIsPlaying={setIsPlaying} jwt={jwt} />
        </>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid, edit } = ctx.query;
    const cookies = nookies.get(ctx);
    const jwt = cookies?.jwt || null;

    try {
        const channel = await getChannel({ channelID: channelid, jwt: jwt, edit: edit });
        
        if (!channel) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        const tags = await getTags(channelid);
        const tilesets = await getTilesets();

        return { 
            props: { 
                channel: channel,
                jwt: channel.canedit && edit ? jwt : null,
                tags: tags,
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
  