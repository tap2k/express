import { getPublicID } from '../hooks/seed';
import getMediaURL from "../hooks/getmediaurl";
import getChannel from "../hooks/getchannel";
import AddMenu from "../components/addmenu";
import Banner from '../components/banner';
import Wall from "../components/wall";

export default ({ channel, privateID }) => {
    
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
                    privateID={privateID}
                />
                <Wall 
                    channel={channel}
                    privateID={privateID}
                />
                <AddMenu channel={channel} privateID={privateID} download />
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid, admin } = ctx.query;
    let privateID = null;
    if (!admin)
        admin = false;

    const publicID = getPublicID(channelid);
    if (publicID)
    {
        privateID = channelid;
        channelid = publicID;
    }

    try {
        // TODO: Hack for testing
        const channel = await getChannel({ channelID: channelid, privateID: privateID ? privateID : admin });
        
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
                privateID: privateID ? privateID : admin
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
