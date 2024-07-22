/* pages/recordvideo.js */

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import RecorderLayout from "../components/recorderlayout";

const VideoRecorder = dynamic(() => import("../components/videorecorder"), { ssr: false, });

export default function RecordVideoPage() {
  const router = useRouter();
  const channelID = router.query.channelid;
  const useLocation = router.query.uselocation === "true";
  
  return (
    <RecorderLayout 
      title="Record Video"
      subtitle="Capture and share your video moment"
      bgColor="#007bff"  // You can choose an appropriate color for video recording
    >
      <VideoRecorder channelID={channelID} useLocation={useLocation} />
    </RecorderLayout>
  );
}