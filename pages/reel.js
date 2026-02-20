import { use100vh } from 'react-div-100vh';
import nookies from 'nookies';
import getChannel from "../hooks/getchannel";
import useInactive from '../hooks/useinactive';
import Slideshow from "../components/slideshow";
import PageMenu from '../components/pagemenu';

export default ({ channel, currslide, jwt }) => {

    const width = "100vw";
    const height = use100vh();
    const isInactive = useInactive();
    //const height = "100vh";

    return (
        <div className={isInactive ? 'inactive-ui' : ''}>
            {jwt && <PageMenu loggedIn={jwt} />}
            <Slideshow channel={channel} width={width} height={height} startSlide={currslide} jwt={jwt} style={{backgroundColor: 'black'}} />
            {!jwt && <a href="/" style={{
                position: 'fixed', bottom: 8, right: 12,
                color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem',
                textDecoration: 'none', zIndex: 1000,
            }}>Powered by Express</a>}
        </div>
    );
}

export async function getServerSideProps(ctx) {
    let { channelid, currslide, edit, end } = ctx.query;
    const cookies = nookies.get(ctx);
    const jwt = cookies?.jwt || null;

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

        return { 
            props: { 
                channel: channel,
                currslide : currslide ? currslide : end ? channel.contents.length: 0,
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
  