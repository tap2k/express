import { useState } from 'react';
import nookies from 'nookies';
import getMediaURL from "../hooks/getmediaurl";
import getChannel from "../hooks/getchannel";
import getUser from "../hooks/getuser";
import AddMenu from "../components/addmenu";
import PageMenu from '../components/pagemenu';
import Banner from '../components/banner';
import Wall from "../components/wall";

export default ({ channel, user, jwt }) => {
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
                <PageMenu loggedIn={jwt} editor />
                <Banner 
                    channel={channel}
                    foregroundColor={channel.foreground_color}
                    user={user}
                    jwt={jwt}
                />
                <Wall 
                    channel={channel}
                    jwt={jwt}
                />
                <AddMenu channel={channel} isPlaying={isPlaying} setIsPlaying={setIsPlaying} jwt={jwt} user={user} download />
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid } = ctx.query;
    const cookies = nookies.get(ctx);
    const jwt = cookies?.jwt || null;

    // TODO: Cant edit if not logged in
    if (!jwt)
    {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    try {
        const user = await getUser(jwt);
        const channel = await getChannel({ channelID: channelid, jwt: jwt, edit: true });
        
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
                jwt: channel.canedit ? jwt : null,
                user: user,
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