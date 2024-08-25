import { useState, useRef } from 'react';
import { FaPlay, FaPause, FaPlus, FaDownload } from 'react-icons/fa';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import styled from 'styled-components';
import getMediaURL from "../hooks/getmediaurl";
import { MenuButton } from '../components/recorderstyles';
import Uploader from "../components/uploader";
import EmailModal from './emailmodal'; 

const CircularMenuButton = styled(MenuButton)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

export default function AddMenu({ channel, privateID }) {
  if (!channel)
    return;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const audioRef = useRef(null);

  const toggleEmailModal = () => {
    setIsEmailModalOpen(!isEmailModalOpen);
  }

  const handleEmailSubmit = async (email) => {
    if (email)
    {
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

  const toggleUploadModal = () => {setIsUploadModalOpen(!isUploadModalOpen)};

  const closeBtn = (
    <button className="close" onClick={() => setIsUploadModalOpen(false)}>
      &times;
    </button>
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
      bottom: '25px',
      right: '10px',
      display: 'flex',
      zIndex: 90,
  };

  return (
    <>
      <div style={containerStyle}>
        { privateID && <CircularMenuButton onClick={toggleEmailModal}>
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
        <CircularMenuButton onClick={toggleUploadModal}>
          <FaPlus />
        </CircularMenuButton>
      </div>
        <Modal isOpen={isUploadModalOpen} toggle={() => setIsUploadModalOpen(false)}>
            <ModalHeader toggle={() => setIsUploadModalOpen(false)} close={closeBtn}>
                Upload
            </ModalHeader>
            <ModalBody>
                <Uploader
                    channelID={channel.uniqueID}
                    toggle={toggleUploadModal}
                />
            </ModalBody>
        </Modal>
        <EmailModal 
          isOpen={isEmailModalOpen} 
          toggle={toggleEmailModal}
          onSubmit={handleEmailSubmit}
          headerText="Download Video"
          bodyText="Please enter your email address below to receive a link to your completed video."
        />
    </>
  );
}
