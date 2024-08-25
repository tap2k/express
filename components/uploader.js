import dynamic from "next/dynamic";
import { useState, useEffect } from 'react';
import useGeolocation from "react-hook-geolocation";
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';
import MyCamera from '../components/mycamera';
import FileUploader from '../components/fileuploader';

const AudioRecorder = dynamic(() => import("../components/audiorecorder"), { ssr: false });
const VideoRecorder = dynamic(() => import("../components/videorecorder"), { ssr: false });

export default ({ channelID, toggle, useLocation=false }) => {
  const [activeComponent, setActiveComponent] = useState('upload');
  const [uploading, setUploading] = useState();

  let lat = null;
  let long = null;

  if (useLocation) {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  const handleSetUploading = (isUploading) => {
    setUploading(isUploading);
    if (!isUploading && toggle) {
      toggle();
    }
  };

  const renderComponent = () => {
    switch(activeComponent) {
      case 'upload':
        return <FileUploader channelID={channelID} uploading={uploading} setUploading={handleSetUploading} lat={lat} long={long} />;
      case 'video':
        return <VideoRecorder channelID={channelID}  uploading={uploading} setUploading={handleSetUploading}lat={lat} long={long} />;
      case 'photo':
        return <MyCamera channelID={channelID}  uploading={uploading} setUploading={handleSetUploading}lat={lat} long={long} />;
      case 'audio':
        return <AudioRecorder channelID={channelID}  uploading={uploading} setUploading={handleSetUploading}lat={lat} long={long} />;
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