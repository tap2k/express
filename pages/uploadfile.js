/* pages/uploadfile.js */

import { useRouter } from "next/router";
import { Alert } from "reactstrap";
import Uploader from "../components/uploader";

export default () => {
  const router = useRouter();
  const channelID = router.query.channelid;
  const useLocation = !(router.query.uselocation == "false");
  
  return (
    <div>
      <Alert color="primary"><h1>Upload Files</h1></Alert>
      <Uploader channelID = { channelID } useLocation = { useLocation } />
    </div>
  );
};
