/* pages/uploadfile.js */

import Uploader from "../components/uploader";

export default function UploadFilePage({ channelID, useLocation }) { 
  return (
    <Uploader channelID = { channelID } useLocation = { useLocation } />
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
