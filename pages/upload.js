import dynamic from "next/dynamic";
import { useState } from 'react';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';
import MyCamera from '../components/mycamera';
import Uploader from '../components/uploader';

const Recorder = dynamic(() => import("../components/recorder"), { ssr: false });
const VideoRecorder = dynamic(() => import("../components/videorecorder"), { ssr: false });

export default function UploadPage({ channelID, useLocation }) {
  const [activeComponent, setActiveComponent] = useState('upload');

  const renderComponent = () => {
    switch(activeComponent) {
      case 'upload':
        return <Uploader channelID={channelID} useLocation={useLocation} />;
      case 'video':
        return <VideoRecorder channelID={channelID} useLocation={useLocation} />;
      case 'photo':
        return <MyCamera channelID={channelID} useLocation={useLocation} />;
      case 'audio':
        return <Recorder channelID={channelID} useLocation={useLocation} />;
      default:
        return null;
    }
  };

  return (
    <RecorderWrapper>
      <ButtonGroup style={{marginBottom: 0}}>
        <StyledButton
          color={activeComponent === 'upload' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('upload')}
        >
          Upload File
        </StyledButton>
        <StyledButton
          color={activeComponent === 'video' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('video')}
        >
          Record Video
        </StyledButton>
        <StyledButton
          color={activeComponent === 'photo' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('photo')}
        >
          Take Photo
        </StyledButton>
        <StyledButton
          color={activeComponent === 'audio' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('audio')}
        >
          Record Message
        </StyledButton>
      </ButtonGroup>

      <div>
        {renderComponent()}
      </div>
    </RecorderWrapper>
  );
}

export async function getServerSideProps(ctx) {
  const channelid = ctx.query.channelid;
  var uselocation = ctx.query.uselocation;
  if (!uselocation)
    uselocation = false;

  if (!channelid || channelid === "null") {
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
