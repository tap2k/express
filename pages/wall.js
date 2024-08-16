import { Alert, Container } from 'reactstrap';
import Wall from "../components/wall";
import getChannel from "../hooks/getchannel";

export default ({ channel, admin }) => {
    const width = "100vw";
    return (
        <>
            <Alert color="light" className="mb-2 py-4">
                <Container className="text-center">
                <h1>{channel.name}</h1>
                {channel.description && <h3>{channel.description}</h3>}
                </Container>
            </Alert>
            <Wall 
                channel={channel} 
                width={width} 
                privateID={admin} 
            />
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
