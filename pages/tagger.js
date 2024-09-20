import { useState } from 'react';
import nookies from 'nookies';
import { getPublicID } from '../hooks/seed';
import getMediaURL from "../hooks/getmediaurl";
import getChannel from "../hooks/getchannel";
import AddMenu from "../components/addmenu";
import Banner from '../components/banner';
import TagWall from "../components/tagwall";

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
                <Banner 
                    channel={channel}
                    foregroundColor={channel.foreground_color}
                    privateID={privateID}
                    jwt={jwt}
                />
                <TagWall
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

    // TODO: Cant edit if not logged in
    if (!privateID && !jwt)
    {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    try {

        const channel = await getChannel({ channelID: channelid, privateID: privateID, jwt: jwt, edit: true });
        
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
