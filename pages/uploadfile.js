/* pages/uploadfile.js */

import { useRouter } from "next/router";
import Uploader from "../components/uploader";

export default function UploadFilePage({ channelID, useLocation }) {
  const router = useRouter();
  const channelID = router.query.channelid;
  const useLocation = router.query.uselocation === "true";
    
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
