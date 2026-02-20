import { useState } from 'react';
import nookies from 'nookies';
import getMediaURL from "../hooks/getmediaurl";
import getChannel from "../hooks/getchannel";
import getUser from "../hooks/getuser";
import getUserPlan from "../hooks/getuserplan";
import AddMenu from "../components/addmenu";
import PageMenu from '../components/pagemenu';
import Banner from '../components/banner';
import Board from "../components/board";

export default ({ channel, user, jwt, planData }) => {
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
                {jwt && <PageMenu loggedIn={jwt} />}
                <Banner 
                    channel={channel}
                    foregroundColor={channel.foreground_color}
                    user={user}
                    jwt={jwt}
                />
                <Board 
                    channel={channel}
                    jwt={jwt}
                />
                <AddMenu channel={channel} isPlaying={isPlaying} setIsPlaying={setIsPlaying} jwt={jwt} planData={planData} />
                {!jwt && <a href="/" style={{
                    position: 'fixed', bottom: 8, right: 12,
                    color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem',
                    textDecoration: 'none', zIndex: 1000,
                }}>Powered by Express</a>}
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid, edit } = ctx.query;
    const cookies = nookies.get(ctx);
    const jwt = cookies?.jwt || null;
    const user = jwt ? await getUser(jwt) : null;

    try {
        // TODO: Hack for testing
        const channel = await getChannel({ channelID: channelid, jwt: jwt, edit: edit });
        
        if (!channel) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            };
        }

        const planData = jwt ? await getUserPlan(jwt) : null;

        return {
            props: {
                channel: channel,
                jwt: channel.canedit && edit ? jwt : null,
                user: user,
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