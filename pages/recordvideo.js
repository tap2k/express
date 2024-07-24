/* pages/recordvideo.js */

import dynamic from "next/dynamic";

const VideoRecorder = dynamic(() => import("../components/videorecorder"), { ssr: false, });

export default function RecordVideoPage({ channelID, useLocation }) {
  return (
    <VideoRecorder channelID={channelID} useLocation={useLocation} />
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