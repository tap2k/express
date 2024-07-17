/* pages/uploadfile.js */

import { useRouter } from "next/router";
import Uploader from "../components/uploader";
import PageLayout from "../components/recordlayout";

export default () => {
  const router = useRouter();
  const channelID = router.query.channelid;
  const useLocation = !(router.query.uselocation == "false");
    
  return (
    <PageLayout 
      title="Upload File"
      subtitle="Share a file from your device"
      bgColor="#007bff"  // You can choose an appropriate color for video recording
    >
      <Uploader channelID = { channelID } useLocation = { useLocation } />
    </PageLayout>
  );
}
