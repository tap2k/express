import Wall from "../components/wall";
import getChannel from "../hooks/getchannel";

export default function Board({ channel, admin }) {
    const width = "100vw";
    return (
        <Wall 
            channel={channel} 
            width={width} 
            privateID={admin} 
            autoPlay 
        />
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
