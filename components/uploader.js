import dynamic from "next/dynamic";
import { useState } from 'react';
import useGeolocation from "react-hook-geolocation";
import { FaUpload, FaVideo, FaCamera, FaMicrophone, FaEnvelope } from 'react-icons/fa';
import { ButtonGroup, StyledButton } from '../components/recorderstyles';
import MyCamera from '../components/mycamera';
import FileUploader from '../components/fileuploader';
import GreetingCard from '../components/greetingcard';

const VideoRecorder = dynamic(() => import("../components/videorecorder"), { ssr: false });

export default function Uploader ({ channelID, privateID, jwt, toggle, useLocation=false }) {
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
        return <FileUploader channelID={channelID} privateID={privateID} jwt={jwt} uploading={uploading} setUploading={handleSetUploading} lat={lat} long={long} />;
      case 'video':
        return <VideoRecorder channelID={channelID} privateID={privateID} jwt={jwt} uploading={uploading} setUploading={handleSetUploading}lat={lat} long={long} />;
      case 'photo':
        return <MyCamera channelID={channelID} privateID={privateID} jwt={jwt} uploading={uploading} setUploading={handleSetUploading}lat={lat} long={long} />;
      case 'audio':
        return <AudioWidget channelID={channelID} privateID={privateID} jwt={jwt} uploading={uploading} setUploading={handleSetUploading}lat={lat} long={long} />;
      case 'card':
        return <GreetingCard channelID={channelID} privateID={privateID} jwt={jwt} uploading={uploading} setUploading={handleSetUploading}lat={lat} long={long} />;
      default:
        return null;
    }
  };

  return (
    <> 
      <ButtonGroup style={{marginBottom: 10}}>
        <StyledButton
          color={activeComponent === 'upload' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('upload')}
        >
          <FaUpload />
        </StyledButton>
        <StyledButton
          color={activeComponent === 'video' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('video')}
        >
           <FaVideo />
        </StyledButton>
        <StyledButton
          color={activeComponent === 'photo' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('photo')}
        >
          <FaCamera />
        </StyledButton>
        <StyledButton
          color={activeComponent === 'audio' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('audio')}
        >
          <FaMicrophone />
        </StyledButton>
        <StyledButton
          color={activeComponent === 'card' ? "primary" : "secondary"}
          onClick={() => setActiveComponent('card')}
        >
          <FaEnvelope />
        </StyledButton>
      </ButtonGroup>

      <div>
        {renderComponent()}
      </div>
    </>
  );
}