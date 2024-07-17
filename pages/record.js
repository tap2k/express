import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import RecorderLayout from "../components/recorderlayout";

const Recorder = dynamic(() => import("../components/recorder"), { ssr: false });

export default function RecordAudioPage() {
  const router = useRouter();
  const channelID = router.query.channelid;
  const useLocation = !(router.query.uselocation === "false");

  return (
    <RecorderLayout 
      title="Record Audio"
      subtitle="Create your audio content here"
      bgColor="#007bff"  // Keep the blue color for audio recording
    >
      <Recorder channelID={channelID} useLocation={useLocation} />
    </RecorderLayout>
  );
}