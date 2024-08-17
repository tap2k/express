import getMediaURL from "../hooks/getmediaurl";
import getChannel from "../hooks/getchannel";
import MakeButton from "../components/makebutton";
import AddButton from "../components/addbutton";
import Banner from '../components/banner';
import Board from "../components/board";

const makeStyle = {
    position: 'absolute',
    top: '10px',
    right: '20px',
    zIndex: 1000
  };

export default ({ channel, admin }) => {
    
    //channel.picture.url = null;
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
                    admin={admin}
                />
                <Board 
                    channel={channel}
                    privateID={admin}
                />
                {!admin && <MakeButton style={makeStyle} />}
                <AddButton channelID={channel.uniqueID}/>
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    const { channelid, admin } = ctx.query;

    try {
        // TODO: Hack for testing
        const channel = await getChannel({ channelID: channelid, privateID: admin });
        
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
                admin: admin ? true : false
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
