import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from "react";
import { Alert, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { FaEdit, FaTrash, FaImage, FaMusic } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import updateChannel from '../hooks/updatechannel';
import deleteChannel from '../hooks/deletechannel';
import sendEmailLinks from '../hooks/sendemaillinks';
import { StyledInput } from './recorderstyles';
import PageMenu from "./pagemenu";
import MediaPicker from './mediapicker';

export default function Banner({ channel, privateID, isSlideshow=false }) {
  if (!channel)
    return;

  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [deletePic, setDeletePic] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteAudio, setDeleteAudio] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const titleRef = useRef();
  const subtitleRef = useRef();
  const emailRef = useRef();


  useEffect(() => {
      setUploading(false);
      setDeletePic(false);
      setSelectedImage(null);
      setSelectedAudio(null);
      setUploadedFiles([]);
      setProgress(0);
  }, [isImageModalOpen, isAudioModalOpen]);

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle}>&times;</button>
  );

  const handleDeleteChannel = () => {
    confirmAlert({
      title: 'Delete reel?',
      message: 'Are you sure you want to delete this reel?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await deleteChannel(channel.uniqueID);
            await router.push('/');
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };



  const handleSaveChannel = async ( ) => {
    setUploading(true);
    const myFormData = new FormData();
    uploadedFiles.forEach(file => myFormData.append(file.name, file, file.name));
    await updateChannel({myFormData: myFormData, name: titleRef.current?.value, description: subtitleRef.current?.value, uniqueID: channel.uniqueID, email: emailRef.current?.value, picturefile: selectedImage, audiofile: selectedAudio, deletePic: deletePic, deleteAudio: deleteAudio, setProgress: setProgress});
    if (emailRef.current?.value != channel.email) {
      await sendEmailLinks({channelID: channel.uniqueID, privateID: privateID, channelName: channel.name, email: emailRef.current?.value});
    }
    setIsChannelModalOpen(false);
    setIsAudioModalOpen(false);
    setIsImageModalOpen(false);
    await router.replace(router.asPath);
  };

  const buttonStyle = {
    fontSize: 'medium',
    width: '100%',
    padding: '6px',
    marginTop: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#5dade2', 
    border: 'none',
    color: '#ffffff',
    fontWeight: 'bold',
  };

  const iconButtonStyle = { 
    background: 'rgba(255, 255, 255, 0.5)', 
    border: 'none', 
    borderRadius: '50%', 
    padding: '5px' 
  }

  return (
    <>
      <PageMenu />
      {!isSlideshow && <Alert 
        style={{
          backgroundColor: 'transparent',
          padding: '1.5rem',
          border: 'none',
          zIndex: 90
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <div style={{
            backgroundColor: 'rgba(230, 240, 255, 0.6)', // Light blue background
            borderRadius: '10px',
            padding: '1.5rem 3rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
          }}>
            <h1 style={{
              color: '#0a4f6a', // Darker blue for better readability
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}>
              {channel.name}
            </h1>
            {channel.description && (
              <h3 style={{
                color: '#24394e', // Deep gray for subtitle
                fontSize: '1.25rem',
                fontWeight: 'normal'
              }}>
                {channel.description}
              </h3>
            )}
              { privateID &&       
                <div style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    display: 'flex',
                    gap: '5px',
                    zIndex: 90
                }}>
                  <button 
                    onClick={() => {
                        setIsAudioModalOpen(true);
                    }} 
                    style={iconButtonStyle}
                    >
                    <FaMusic size={20} color="rgba(0, 0, 0, 0.5)"/>
                  </button>
                  <button 
                    onClick={() => {
                        setIsImageModalOpen(true);
                    }} 
                    style={iconButtonStyle}
                    >
                    <FaImage size={20} color="rgba(0, 0, 0, 0.5)"/>
                  </button>
                  <button 
                      onClick={() => {
                          setIsChannelModalOpen(true);
                      }} 
                      style={iconButtonStyle}
                      >
                      <FaEdit size={20} color="rgba(0, 0, 0, 0.5)"/>
                  </button>
                  <button 
                      onClick={handleDeleteChannel} 
                      style={iconButtonStyle}
                      >
                      <FaTrash size={20} color="rgba(0, 0, 0, 0.5)" />
                  </button>
              </div>
            }
          </div>
        </div>
      </Alert>
      }
      
      <Modal isOpen={isChannelModalOpen} toggle={() => setIsChannelModalOpen(false)}>
        <ModalHeader close={closeBtn(() => setIsChannelModalOpen(false))}></ModalHeader>
        <ModalBody>
          <StyledInput
          type="text"
          innerRef={titleRef}
          placeholder="Enter your title here"
          defaultValue={channel.name || ""}
          />
          <StyledInput
            type="email"
            innerRef={emailRef}
            placeholder="Update your email here"
            defaultValue={channel.email || ""}
          />
          <Button
            onClick={handleSaveChannel}
            style={buttonStyle}
          >
            {'Update Reel'}
          </Button>
        </ModalBody>
      </Modal>

      <Modal isOpen={isAudioModalOpen} toggle={() => {setIsAudioModalOpen(false); setDeleteAudio(false)}}>
        <ModalHeader close={closeBtn(() => setIsAudioModalOpen(false))}></ModalHeader>
        <ModalBody>
          <MediaPicker mediaUrl={channel.audiofile?.url} progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} selectedMedia={selectedAudio} setSelectedMedia={setSelectedAudio} deleteMedia={deleteAudio} setDeleteMedia={setDeleteAudio} accept="audio/*" gallery="audio" />
          <Button
            onClick={handleSaveChannel}
            disabled={uploading || (!uploadedFiles.length && !deleteAudio && !selectedAudio)}
            block
            color="success"
            style={{marginTop: '10px'}}
          >
            {'Update Reel'}
          </Button>
        </ModalBody>
      </Modal>

      <Modal isOpen={isImageModalOpen} toggle={() => {setIsImageModalOpen(false); setDeletePic(false)}}>
        <ModalHeader close={closeBtn(() => setIsImageModalOpen(false))}></ModalHeader>
        <ModalBody>
          <MediaPicker mediaUrl={channel.picture?.url} progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} selectedMedia={selectedImage} setSelectedMedia={setSelectedImage} deleteMedia={deletePic} setDeleteMedia={setDeletePic} uploading={uploading} setUploading={setUploading} accept="image/*" gallery="image" />
          <Button
            onClick={handleSaveChannel}
            disabled={uploading || (!uploadedFiles.length && !deletePic && !selectedImage)}
            block
            color="success"
            style={{marginTop: '10px'}}
          >
            {'Update Reel'}
          </Button>
        </ModalBody>
      </Modal>
    </>
  );
}
