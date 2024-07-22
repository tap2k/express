import { useRouter } from "next/router";
import MyCamera from "../components/mycamera";
import RecorderLayout from "../components/recorderlayout";

export default function TakePhotoPage() {
  const router = useRouter();
  const channelID = router.query.channelid;
  const useLocation = router.query.uselocation === "true";
  
  return (
    <RecorderLayout 
      title="Take a Photo"
      subtitle="Capture and share your moment"
      bgColor="#007bff"
    >
      <MyCamera channelID={channelID} useLocation={useLocation} />
    </RecorderLayout>
  );
}