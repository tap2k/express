import { useState, useRef } from 'react';
import { FaPlay, FaPause, FaPlus } from 'react-icons/fa';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import styled from 'styled-components';
import getMediaURL from "../hooks/getmediaurl";
import { MenuButton } from '../components/recorderstyles';
import Uploader from "../components/uploader";

const CircularMenuButton = styled(MenuButton)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

export default function AddMenu({ channel }) {
  if (!channel)
    return;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
      if (isPlaying) {
          audioRef.current.pause();
      } else {
          audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
  };

  const toggle = () => {setIsUploadModalOpen(!isUploadModalOpen)};

  const closeBtn = (
    <button className="close" onClick={() => setIsUploadModalOpen(false)}>
      &times;
    </button>
  );

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
          {channel.audiofile?.url && (
              <>
                  <audio ref={audioRef} src={getMediaURL() + channel.audiofile.url} />
                  <CircularMenuButton onClick={togglePlayPause}>
                      {isPlaying ? (
                          <FaPause color="rgba(240, 240, 240, 1)" />
                      ) : (
                          <FaPlay color="rgba(240, 240, 240, 1)" />
                      )}
                  </CircularMenuButton>
              </>
          )}
        <CircularMenuButton onClick={toggle}>
            <FaPlus color="rgba(240, 240, 240, 1)" />
        </CircularMenuButton>
      </div>
        <Modal isOpen={isUploadModalOpen} toggle={() => setIsUploadModalOpen(false)}>
            <ModalHeader toggle={() => setIsUploadModalOpen(false)} close={closeBtn}>
                Upload
            </ModalHeader>
            <ModalBody>
                <Uploader
                    channelID={channel.uniqueID}
                    toggle={toggle}
                />
            </ModalBody>
        </Modal>
    </>
  );
}
