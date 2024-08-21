import { getPublicID } from '../hooks/seed';
import getChannel from "../hooks/getchannel";
import getMediaURL from "../hooks/getmediaurl";
import Banner from "../components/banner";
import Board from "../components/board";

export default ({ channel, privateID }) => {
    const backgroundStyle = channel.picture?.url 
        ? {
            backgroundImage: `url(${getMediaURL() + channel.picture.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }
        : {};

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
                    privateID={privateID}
                />
                <Board 
                    channel={channel}
                    privateID={privateID}
                />
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    const { channelid } = ctx.query;
    
    const publicID = getPublicID(channelid);
    if (!channelid || !publicID)
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };

    try {
        const channel = await getChannel({ channelID: publicID, privateID: channelid });
        
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
                privateID: channelid
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
  