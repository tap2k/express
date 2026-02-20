import { useState, useRef } from 'react';
import { FaPlay, FaPause, FaPlus } from 'react-icons/fa';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import styled from 'styled-components';
import getMediaURL from "../hooks/getmediaurl";
import { MenuButton } from '../components/recorderstyles';
import Uploader from "../components/uploader";

const CircularMenuButton = styled(MenuButton)`
  width: clamp(16px, 3rem, 50px);
  height: clamp(16px, 3rem, 50px);
  border-radius: 50%;
`;

export default function AddMenu({ channel, isPlaying, setIsPlaying, privateID, jwt, planData }) {
  if (!channel)
    return;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const audioRef = useRef(null);

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle} title="Close">&times;</button>
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

  return (
    <>
      <div style={containerStyle}>
        {channel.audiofile?.url && false &&
          <>
            <audio ref={audioRef} src={getMediaURL() + channel.audiofile.url} />
            <CircularMenuButton onClick={togglePlayPause} title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? (
                    <FaPause />
                ) : (
                    <FaPlay />
                )}
            </CircularMenuButton>
          </> }
        { (privateID || jwt || channel.allowsubmissions) && <CircularMenuButton onClick={() => setIsUploadModalOpen(true)} title="Add content">
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
                planData={planData}
            />
          </ModalBody>
        </Modal>
    </>
  );
}
