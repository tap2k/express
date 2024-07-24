import dynamic from "next/dynamic";

const Recorder = dynamic(() => import("../components/recorder"), { ssr: false, });

export default function RecordAudioPage({ channelID, useLocation }) {
  return (
    <Recorder channelID={channelID} useLocation={useLocation} />
  );
}

export async function getServerSideProps(ctx) {
    const { channelid, uselocation } = ctx.query;
  
    if (!channelid) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
  
    return {
        props: { channelID: channelid, useLocation: uselocation }
    };
  }