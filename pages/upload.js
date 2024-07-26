import dynamic from "next/dynamic";
import { useState } from 'react';
import { TabContent, TabPane } from 'reactstrap';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';
import MyCamera from '../components/mycamera';
import Uploader from '../components/uploader';

const Recorder = dynamic(() => import("../components/recorder"), { ssr: false, });
const VideoRecorder = dynamic(() => import("../components/videorecorder"), { ssr: false, });

export default function UploadPage({ channelID, useLocation }) {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  return (
    <RecorderWrapper>
      <ButtonGroup style={{ marginBottom: '5px' }}>
        <StyledButton
          color={activeTab === '1' ? "primary" : "secondary"}
          onClick={() => { toggle('1'); }}
        >
          Video
        </StyledButton>
        <StyledButton
          color={activeTab === '2' ? "primary" : "secondary"}
          onClick={() => { toggle('2'); }}
        >
          Photo
        </StyledButton>
        <StyledButton
          color={activeTab === '3' ? "primary" : "secondary"}
          onClick={() => { toggle('3'); }}
        >
          Audio
        </StyledButton>
        <StyledButton
          color={activeTab === '4' ? "primary" : "secondary"}
          onClick={() => { toggle('4'); }}
        >
          Upload
        </StyledButton>

      </ButtonGroup>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <VideoRecorder channelID={channelID} useLocation={useLocation} />
        </TabPane>
        <TabPane tabId="2">
          <MyCamera channelID={channelID} useLocation={useLocation} />
        </TabPane>
        <TabPane tabId="3">
          <Recorder channelID={channelID} useLocation={useLocation} />
        </TabPane>
        <TabPane tabId="4">
          <Uploader channelID={channelID} useLocation={useLocation} />
        </TabPane>
      </TabContent>
    </RecorderWrapper>
  );
}

export async function getServerSideProps(ctx) {
  const channelid = ctx.query.channelid;
  var uselocation = ctx.query.uselocation;
  if (!uselocation)
    uselocation = false;

  if (!channelid | channelid === "null") {
      return {
          redirect: {
              destination: '/',
              permanent: false,
          },
      };
  }

  return {
      props: { channelID: channelid, useLocation: uselocation }
  };
}
