/* pages/uploadfile.js */

import { useRouter } from "next/router";
import Uploader from "../components/uploader";
import RecorderLayout from "../components/recorderlayout";

export default () => {
  const router = useRouter();
  const channelID = router.query.channelid;
  const useLocation = router.query.uselocation === "true";
    
  return (
    <RecorderLayout 
      title="Upload File"
      subtitle="Share a file from your device"
      bgColor="#007bff"  // You can choose an appropriate color for video recording
    >
      <Uploader channelID = { channelID } useLocation = { useLocation } />
    </RecorderLayout>
  );
}
