import getChannel from "../hooks/getchannel";
import MakeButton from "../components/makebutton";
import AddButton from "../components/addbutton";
import Banner from '../components/banner';
import Board from "../components/board";

export default ({ channel }) => {
    return (
        <>
            <Banner 
                title={channel.name} 
                subtitle={channel.description} 
            />
            <Board 
                channel={channel} 
            />
            <MakeButton />
            <AddButton channelID={channel.uniqueID}/>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const { channelid } = ctx.query;

    try {
        const channel = await getChannel({ channelID: channelid });
        
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
                channel: channel
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
