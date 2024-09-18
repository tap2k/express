import { useState } from 'react';
import nookies from 'nookies';
import { getPublicID } from '../hooks/seed';
import getMediaURL from "../hooks/getmediaurl";
import getChannel from "../hooks/getchannel";
import AddMenu from "../components/addmenu";
import PageMenu from '../components/pagemenu';
import Banner from '../components/banner';
import Board from "../components/board";

export default ({ channel, privateID, jwt }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const backgroundStyle = channel.picture?.url 
        ? {
            backgroundImage: `url(${getMediaURL() + channel.picture.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }
        : channel.background_color ? {
            backgroundColor: channel.background_color
        }
        : ""

    return (
        <div style={{
            minHeight: '100vh',
            ...backgroundStyle
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                minHeight: '100vh',
                padding: '4rem',
            }}>
                <PageMenu loggedIn={privateID || jwt} /> 
                <Banner 
                    channel={channel}
                    foregroundColor={!channel.picture?.url && channel.foreground_color}
                    privateID={privateID}
                    jwt={jwt}
                />
                <Board 
                    channel={channel}
                    privateID={privateID}
                    jwt={jwt}
                />
                <AddMenu channel={channel} isPlaying={isPlaying} setIsPlaying={setIsPlaying} privateID={privateID} jwt={jwt} />
            </div>
        </div>
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
        // TODO: Hack for testing
        const channel = await getChannel({ channelID: channelid, privateID: privateID, jwt: jwt, edit: edit });
        
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
                jwt: channel.canedit && edit ? jwt : null
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
