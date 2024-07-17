/* pages/record.js */

import { Alert } from "reactstrap";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Recorder = dynamic(() => import("../components/recorder"), { ssr: false, });

export default () => {
  const router = useRouter();
  const channelID = router.query.channelid;
  const useLocation = !(router.query.uselocation == "false");

  return (
  <div>
    <Alert color="primary">
      <h1>record audio</h1>
    </Alert>
    <Recorder channelID = { channelID } useLocation = { useLocation } />
    <p/>
  </div>
  );
};

