import { useState } from 'react';
import nookies from 'nookies';
import dynamic from "next/dynamic";
import { use100vh } from 'react-div-100vh';
import PageMenu from '../components/pagemenu';
//import Banner from "../components/banner";
import AddMenu from "../components/addmenu";
import getChannel from "../hooks/getchannel";
import getTilesets from "../hooks/gettilesets";
import getUserPlan from "../hooks/getuserplan";

const Mapper = dynamic(() => import("../components/mapper.js"), { ssr: false });

export default ({ channel, tilesets, jwt, planData }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const width = "100vw";
    const height = use100vh();
    //const height = "100vh";

    return (
        <>
            <div style={{ position: 'absolute', width: width}}>
                {jwt && <PageMenu loggedIn={jwt} />}
                {/*<Banner 
                    channel={channel}
                    foregroundColor={channel.foreground_color}
                    jwt={jwt}
                />*/}
            </div>
            <Mapper style={{width: width, height: height}} channel={channel} itemWidth={250} isPlaying={isPlaying} tilesets={tilesets} jwt={jwt} legend planData={planData} />
            <AddMenu channel={channel} isPlaying={isPlaying} setIsPlaying={setIsPlaying} jwt={jwt} />
            {!jwt && <a href="/" style={{
                position: 'fixed', bottom: 20, right: 0,
                color: 'rgba(0,0,0,0.6)', fontSize: '0.75rem',
                textDecoration: 'none', zIndex: 1000,
                backgroundColor: 'rgba(255,255,255,0.7)',
                padding: '2px 6px', borderRadius: '4px',
            }}>Powered by Express</a>}
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

        const tilesets = await getTilesets();
        const planData = jwt ? await getUserPlan(jwt) : null;

        return {
            props: {
                channel: channel,
                jwt: channel.canedit && edit ? jwt : null,
                tilesets: tilesets,
                planData: planData,
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
  