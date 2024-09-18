import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { FaEdit, FaTrash, FaImage, FaMusic, FaUserPlus } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import updateChannel from '../hooks/updatechannel';
import deleteChannel from '../hooks/deletechannel';
import sendEmailLinks from '../hooks/sendemaillinks';
import { IconButton } from './recorderstyles';
import ChannelInputs from "./channelinputs";
import EditorAdder from "./editoradder";
import EditorTable from "./editortable";
import MediaPicker from './mediapicker';

export default function ChannelControls ({ channel, setIsModalOpen, privateID, jwt, iconSize=20, flex="row" }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [deletePic, setDeletePic] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteAudio, setDeleteAudio] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const titleRef = useRef();
  const subtitleRef = useRef();
  const emailRef = useRef();
  const showTitleRef = useRef();
  const publicRef = useRef();
  const allowRef = useRef();
  const intervalRef = useRef();
  const router = useRouter();

  if (!channel || (!privateID && !jwt))
    return;

  useEffect(() => {
    if (setIsModalOpen)
      setIsModalOpen(isImageModalOpen || isAudioModalOpen || isChannelModalOpen || isUserModalOpen)
    setUploading(false);
    setDeletePic(false);
    setSelectedImage(null);
    setSelectedAudio(null);
    setUploadedFiles([]);
    setProgress(0);
  }, [isImageModalOpen, isAudioModalOpen, isChannelModalOpen, isUserModalOpen]);

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
            await deleteChannel({ channelID: channel.uniqueID, privateID, jwt });
            router.push('/');
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
    await updateChannel({myFormData: myFormData, name: titleRef.current?.value, description: subtitleRef.current?.value, email: emailRef.current?.value, ispublic: publicRef.current?.checked, allowsubmissions: allowRef.current?.checked, showtitle: showTitleRef.current?.checked, interval: intervalRef.current?.value, picturefile: selectedImage, audiofile: selectedAudio, backgroundColor: selectedColor, deletePic: deletePic, deleteAudio: deleteAudio, setProgress: setProgress, channelID: channel.uniqueID, privateID, jwt});
    if (emailRef.current?.value != channel.email) {
      await sendEmailLinks({channelID: channel.uniqueID, privateID: privateID, channelName: channel.name, email: emailRef.current?.value});
    }
    setIsChannelModalOpen(false);
    setIsAudioModalOpen(false);
    setIsImageModalOpen(false);
    router.replace(router.asPath);
  };

  const iconBarStyle = {
      position: 'absolute',
      top: '5px',
      right: '5px',
      display: 'flex',
      flexDirection: flex,
      gap: '2px',
      zIndex: 1
  };

  return (
    <>
      <div style={iconBarStyle} className="hide-on-inactive">
        <IconButton 
          onClick={() => {
              setIsAudioModalOpen(true);
          }} 
          >
          <FaMusic size={iconSize} />
        </IconButton>
        <IconButton 
          onClick={() => {
              setIsImageModalOpen(true);
          }} 
          >
          <FaImage size={iconSize} />
        </IconButton>
        { channel.owned && <IconButton 
          onClick={() => {
              setIsUserModalOpen(true);
          }} 
          >
          <FaUserPlus size={iconSize} />
        </IconButton> }
        <IconButton 
            onClick={() => {
                setIsChannelModalOpen(true);
            }} 
            >
            <FaEdit size={iconSize} />
        </IconButton>
        { channel.owned && <IconButton 
            onClick={handleDeleteChannel} 
            >
            <FaTrash size={iconSize} />
        </IconButton> }
    </div>

    <Modal isOpen={isChannelModalOpen} toggle={() => setIsChannelModalOpen(false)}>
      <ModalHeader close={closeBtn(() => setIsChannelModalOpen(false))}></ModalHeader>
      <ModalBody>
        <ChannelInputs 
          channel={channel} 
          titleRef={titleRef} 
          subtitleRef={subtitleRef} 
          emailRef={jwt ? null : emailRef} 
          publicRef={publicRef} 
          allowRef={allowRef} 
          showTitleRef={showTitleRef} 
        />
        <Button onClick={handleSaveChannel} block color="success" style={{marginTop: '20px'}}>
          <b>Update Reel</b>
        </Button>
      </ModalBody>
    </Modal>

    <Modal isOpen={isAudioModalOpen} toggle={() => {setIsAudioModalOpen(false); setDeleteAudio(false)}}>
      <ModalHeader close={closeBtn(() => setIsAudioModalOpen(false))}></ModalHeader>
      <ModalBody>
        <MediaPicker mediaUrl={channel.audiofile?.url} progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} selectedMedia={selectedAudio} setSelectedMedia={setSelectedAudio} deleteMedia={deleteAudio} setDeleteMedia={setDeleteAudio} accept="audio/*" gallery="audio" />
        <Button
          onClick={handleSaveChannel}
          disabled={uploading || (!uploadedFiles.length && !deleteAudio && !selectedAudio && !selectedColor)}
          block
          color="success"
          style={{marginTop: '10px'}}
        >
          <b>Update Reel</b>
        </Button>
      </ModalBody>
    </Modal>

    <Modal isOpen={isImageModalOpen} toggle={() => {setIsImageModalOpen(false); setDeletePic(false)}}>
      <ModalHeader close={closeBtn(() => setIsImageModalOpen(false))}></ModalHeader>
      <ModalBody>
        <MediaPicker mediaUrl={channel.picture?.url} progress={progress} setProgress={setProgress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} selectedMedia={selectedImage} setSelectedMedia={setSelectedImage} selectedColor={selectedColor} setSelectedColor={setSelectedColor} deleteMedia={deletePic} setDeleteMedia={setDeletePic} uploading={uploading} setUploading={setUploading} generating={uploading} setGenerating={setUploading} accept="image/*" gallery="image" dalle />
        <Button
          onClick={handleSaveChannel}
          disabled={uploading || (!uploadedFiles.length && !deletePic && !selectedImage && !selectedColor)}
          block
          color="success"
          style={{marginTop: '10px'}}
        >
          <b>Update Reel</b>
        </Button>
      </ModalBody>
    </Modal>

    <Modal isOpen={isUserModalOpen} toggle={() => {setIsUserModalOpen(false)}}>
      <ModalHeader close={closeBtn(() => setIsUserModalOpen(false))}>Project Editors</ModalHeader>
      <ModalBody>
        <EditorTable channel={channel} maxHeight={400} jwt={jwt} />
        <EditorAdder channel={channel} jwt={jwt} />
      </ModalBody>
    </Modal>
  </>
);};
