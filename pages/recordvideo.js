/* pages/recordvideo.js */

import { Alert } from "reactstrap";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const VideoRecorder = dynamic(() => import("../components/videorecorder"), { ssr: false, });

export default () => {
  const router = useRouter();
  const channelID = router.query.channelid;
  const useLocation = !(router.query.uselocation === "false");

  return (
  <div>
    <Alert color="primary">
      <h1>record video</h1>
    </Alert>
    <VideoRecorder channelID = { channelID } useLocation = { useLocation } />
    <p/>
  </div>
  );
};

