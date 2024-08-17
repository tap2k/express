import getChannel from "../hooks/getchannel";
import MakeButton from "../components/makebutton";
import AddButton from "../components/addbutton";
import Banner from '../components/banner';
import Wall from "../components/wall";

export default ({ channel, admin }) => {
    const width = "100vw";
    return (
        <>
            <Banner 
                title={channel.name} 
                subtitle={channel.description} 
            />
            <Wall 
                channel={channel} 
                width={width} 
                privateID={admin} 
            />
            {!admin && <MakeButton />}
            <AddButton channelID={channel.uniqueID}/>
        </>
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
