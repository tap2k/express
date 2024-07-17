/* pages/takephoto.js */

import { useRouter } from "next/router";
import { Alert } from "reactstrap";
import MyCamera from "../components/mycamera";

export default () => {
  const router = useRouter();
  const channelID = router.query.channelid;
  const useLocation = !(router.query.uselocation == "false");
  
  return (
  <div>
    <Alert color="primary"><h1>Take a Photo</h1></Alert>
    <MyCamera channelID = { channelID } useLocation = { useLocation } />
  </div>
  );
};
