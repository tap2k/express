import axios from 'axios';
import { useState, useRef } from 'react';
import { FaPlay, FaPause, FaPlus, FaDownload, FaSave } from 'react-icons/fa';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import styled from 'styled-components';
import saveChannel from "../hooks/savechannel";
import getMediaURL from "../hooks/getmediaurl";
import { MenuButton } from '../components/recorderstyles';
import Uploader from "../components/uploader";
import EmailModal from './emailmodal'; 

const CircularMenuButton = styled(MenuButton)`
  width: clamp(16px, 3rem, 50px);
  height: clamp(16px, 3rem, 50px);
  border-radius: 50%;
`;

export default function AddMenu({ channel, privateID, jwt, download }) {
  if (!channel)
    return;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const audioRef = useRef(null);

  const handleEmailSubmit = async (email) => {
    if (email)
    {
      await saveChannel({channel, privateID, jwt});
      const response = await axios.post('/api/makevideo', 
        {
          channelid: channel.uniqueID, // Assuming channelID is in cleanedData
          email: email}, 
        {
          headers: {
              'Content-Type': 'application/json'
        }
      });
      alert("Your video has been submitted for processing! You will receive an email when it is completed.");
    }
    setIsEmailModalOpen(false);
  };

  const handleSaveChannel = async() => {
    await saveChannel({channel, privateID, jwt});
    alert("Channel saved!");
  }

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle}>&times;</button>
  );

  const togglePlayPause = () => {
      if (isPlaying) {
          audioRef.current.pause();
      } else {
          audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
  };

  const containerStyle = {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      display: 'flex',
      zIndex: 90,
  };

  return (
    <>
      <div style={containerStyle}>
        { privateID && download && <CircularMenuButton onClick={handleSaveChannel} >
          <FaSave  />
        </CircularMenuButton> }
        { download && <CircularMenuButton onClick={() => setIsEmailModalOpen(true)}>
          <FaDownload  />
        </CircularMenuButton> }
        {channel.audiofile?.url && (
            <>
                <audio ref={audioRef} src={getMediaURL() + channel.audiofile.url} />
                <CircularMenuButton onClick={togglePlayPause}>
                    {isPlaying ? (
                        <FaPause />
                    ) : (
                        <FaPlay />
                    )}
                </CircularMenuButton>
            </>
        )}
        { (privateID || jwt || channel.allowsubmissions) && <CircularMenuButton onClick={() => setIsUploadModalOpen(true)}>
          <FaPlus />
        </CircularMenuButton> }
      </div>
        <Modal isOpen={isUploadModalOpen} toggle={() => setIsUploadModalOpen(false)}>
          <ModalHeader toggle={() => setIsUploadModalOpen(false)} close={closeBtn(() => setIsUploadModalOpen(false))} />
          <ModalBody>
            <Uploader
                channelID={channel.uniqueID}
                privateID={privateID}
                jwt={jwt}
                toggle={() => setIsUploadModalOpen(false)}
            />
          </ModalBody>
        </Modal>
        <EmailModal 
          isOpen={isEmailModalOpen} 
          toggle={() => setIsEmailModalOpen(false)}
          onSubmit={handleEmailSubmit}
          headerText="Download Video"
          bodyText="Please enter your email address below to receive a link to your completed video."
        />
    </>
  );
}
