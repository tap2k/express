import dynamic from "next/dynamic";
import { useState } from 'react';
import useGeolocation from "react-hook-geolocation";
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';
import MyCamera from '../components/mycamera';
import Uploader from '../components/uploader';

const Recorder = dynamic(() => import("../components/recorder"), { ssr: false });
const VideoRecorder = dynamic(() => import("../components/videorecorder"), { ssr: false });

export default ({ channelID, useLocation }) => {
  const [activeComponent, setActiveComponent] = useState('upload');
  const [uploading, setUploading] = useState(false);

  let lat = null;
  let long = null;

  if (useLocation) {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  const renderComponent = () => {
    switch(activeComponent) {
      case 'upload':
        return <Uploader channelID={channelID} uploading={uploading} setUploading={setUploading} lat={lat} long={long} />;
      case 'video':
        return <VideoRecorder channelID={channelID}  uploading={uploading} setUploading={setUploading}lat={lat} long={long} />;
      case 'photo':
        return <MyCamera channelID={channelID}  uploading={uploading} setUploading={setUploading}lat={lat} long={long} />;
      case 'audio':
        return <Recorder channelID={channelID}  uploading={uploading} setUploading={setUploading}lat={lat} long={long} />;
      default:
        return null;
    }
  };

  return (
    <RecorderWrapper>
      <ButtonGroup style={{marginBottom: 10}}>
        <StyledButton
          color={activeComponent === 'upload' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('upload')}
        >
          Upload
        </StyledButton>
        <StyledButton
          color={activeComponent === 'video' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('video')}
        >
          Video
        </StyledButton>
        <StyledButton
          color={activeComponent === 'photo' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('photo')}
        >
          Photo
        </StyledButton>
        <StyledButton
          color={activeComponent === 'audio' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('audio')}
        >
          Audio
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
