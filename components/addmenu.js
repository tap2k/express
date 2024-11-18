import axios from 'axios';
import { useState, useRef } from 'react';
import { FaPlay, FaPause, FaPlus, FaDownload, FaSave } from 'react-icons/fa';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import styled from 'styled-components';
import saveChannel from "../hooks/savechannel";
import getMediaURL from "../hooks/getmediaurl";
import { MenuButton } from '../components/recorderstyles';
import Uploader from "../components/uploader";
//import FileUploader from "../components/fileuploader";
import EmailModal from './emailmodal'; 

const CircularMenuButton = styled(MenuButton)`
  width: clamp(16px, 3rem, 50px);
  height: clamp(16px, 3rem, 50px);
  border-radius: 50%;
`;

export default function AddMenu({ channel, isPlaying, setIsPlaying, privateID, jwt, user, download }) {
  if (!channel)
    return;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const audioRef = useRef(null);

  const handleDownload = async () => {
    await saveChannel({channel, privateID, jwt});
    confirmAlert({
      title: 'Create Video',
      message: 'Are you sure you want to create this video?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            if (user?.email) {
              handleEmailSubmit(user.email);
            } else {
              setIsEmailModalOpen(true);
            }
          }
        },
        {
          label: 'No',
          onClick: () => {} // Do nothing if they click No
        }
      ]
    });
  };

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
    else
      alert("You can't make a video without providing a valid email address.");
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
    if (audioRef.current)
    {
      if (isPlaying) 
          audioRef.current.pause();
      else
          audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const containerStyle = {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      display: 'flex',
      zIndex: 1,
  };

  // TODO: Can only download if logged in; save automatically with download
  return (
    <>
      <div style={containerStyle}>
        { jwt && download && <CircularMenuButton onClick={handleSaveChannel} >
          <FaSave  />
        </CircularMenuButton> }
        { jwt && download && <CircularMenuButton onClick={handleDownload}>
          <FaDownload  />
        </CircularMenuButton> }
        {channel.audiofile?.url && false && 
          <>
            <audio ref={audioRef} src={getMediaURL() + channel.audiofile.url} />
            <CircularMenuButton onClick={togglePlayPause}>
                {isPlaying ? (
                    <FaPause />
                ) : (
                    <FaPlay />
                )}
            </CircularMenuButton> 
          </> }
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
