import { useRouter } from "next/router";
import MyCamera from "../components/mycamera";
import PageLayout from "../components/recordlayout";

export default function TakePhotoPage() {
  const router = useRouter();
  const channelID = router.query.channelid;
  const useLocation = !(router.query.uselocation === "false");
  
  return (
    <PageLayout 
      title="Take a Photo"
      subtitle="Capture and share your moment"
      bgColor="#28a745"
    >
      <MyCamera channelID={channelID} useLocation={useLocation} />
    </PageLayout>
  );
}