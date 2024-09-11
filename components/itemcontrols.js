import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { FaGripVertical, FaEdit, FaTrash, FaCheck, FaTimes, FaMicrophone, FaArrowLeft, FaArrowRight, FaImage } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import deleteSubmission from '../hooks/deletesubmission';
import updateSubmission from '../hooks/updatesubmission';
import { getMediaInfo } from './content';
import { IconButton } from './recorderstyles';
import ContentEditor from "./contenteditor";
import MediaPicker from './mediapicker';

const Voiceover = dynamic(() => import("../components/voiceover"), { ssr: false });

export default function ItemControls ({ contentItem, privateID, jwt, dragRef, moveSlide, setIsModalOpen, iconSize=20, flex="row" }) {

  if (!contentItem || (!privateID && !jwt))
    return;

  const router = useRouter();

  let {url, type} = getMediaInfo(contentItem);
  console.log(url + " " + type);

  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(contentItem?.background_color);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (setIsModalOpen)
      setIsModalOpen(isEditModalOpen || isVoiceModalOpen || isImageModalOpen);
  }, [isEditModalOpen, isVoiceModalOpen, isImageModalOpen]);

  const handlePublish = async () => {
    try {
      await updateSubmission({contentID: contentItem.id, published: !contentItem.publishedAt, jwt});
      router.replace(router.asPath, undefined, { scroll: false });
    } catch (error) {
      console.error("Error updating publish status:", error);
    }
  };

  const handleDelete = () => {
    confirmAlert({
      title: 'Delete item?',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteSubmission({contentID: contentItem.id, privateID, jwt});
              router.replace(router.asPath, undefined, { scroll: false });
            } catch (error) {
              console.error("Error deleting submission:", error);
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleUpload = async ( ) => {
    setUploading(true);
    const myFormData = new FormData();
    if (selectedImage && selectedImage !== "None") {
      if (selectedImage.startsWith('data:image/png;base64,')) {
        // This is a DALL-E generated image
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        myFormData.append('mediafile', blob, 'dalle-image.png');
      } else {
        // This is a regular gallery image
        const response = await fetch(`images/${selectedImage}`);
        const blob = await response.blob();
        myFormData.append('mediafile', blob, "maustrocard-"+selectedImage);
      }
    }
    else
    {
      if (uploadedFiles.length)
        myFormData.append("mediafile", uploadedFiles[0], uploadedFiles[0].name);
    }
    await updateSubmission({contentID: contentItem.id, myFormData: myFormData, backgroundColor: selectedColor, deleteMedia: deleteImage, setProgress, privateID, jwt});
    setIsImageModalOpen(false);
    setUploading(false);
    router.replace(router.asPath);
  };

  const iconBarStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    display: 'flex',
    flexDirection: flex,
    gap: '2px',
    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
    opacity: 1,
    visibility: 'visible',
    zIndex: 100
  };

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle}>&times;</button>
  );

  return (
    <>
      <div style={iconBarStyle}>
        { dragRef && <IconButton 
          ref={dragRef}
        >
          <FaGripVertical size={iconSize} />
        </IconButton> }
        { moveSlide && <>
          <IconButton onClick={() => moveSlide(-1)}>
            <FaArrowLeft size={iconSize} />
          </IconButton>
          <IconButton onClick={() => moveSlide(1)}>
            <FaArrowRight size={iconSize} />
          </IconButton>
        </> }
        { (type.startsWith("image") || type.startsWith("text")) && <IconButton 
          onClick={() => {
            setIsVoiceModalOpen(true);
          }} 
        >
          <FaMicrophone size={iconSize} />
        </IconButton> }
        {((type.startsWith("image") && ((contentItem.mediafile?.url.indexOf("maustrocard") != -1) || contentItem.mediafile?.url.indexOf("dalle") != -1)) || type.startsWith("text") || type.startsWith("audio")) && <IconButton 
          onClick={() => {
            setIsImageModalOpen(true);
          }} 
        >
          <FaImage size={iconSize} />
        </IconButton> }
        <IconButton
          onClick={() => {
            setisEditModalOpen(true);
          }} 
        >
          <FaEdit size={iconSize} />
        </IconButton>
        <IconButton 
          onClick={handlePublish} 
        >
          {contentItem.publishedAt ? 
            <FaTimes size={iconSize} /> : 
            <FaCheck size={iconSize} />
          }
        </IconButton>
        <IconButton 
          onClick={handleDelete} 
        >
          <FaTrash size={iconSize} />
        </IconButton>
      </div>
      <ContentEditor contentItem={contentItem} isModalOpen={isEditModalOpen} setIsModalOpen={setisEditModalOpen} privateID={privateID} jwt={jwt} />
      <Voiceover contentItem={contentItem} isModalOpen={isVoiceModalOpen} setIsModalOpen={setIsVoiceModalOpen} privateID={privateID} jwt={jwt} />
      <Modal isOpen={isImageModalOpen} toggle={() => {setIsImageModalOpen(false)}}>
      <ModalHeader close={closeBtn(() => setIsImageModalOpen(false))}></ModalHeader>
      <ModalBody>
        <MediaPicker mediaUrl={contentItem.mediafile?.url} progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} selectedColor={selectedColor} setSelectedColor={setSelectedColor} selectedMedia={selectedImage} setSelectedMedia={setSelectedImage} deleteMedia={deleteImage} setDeleteMedia={setDeleteImage} accept="image/*" gallery="image" />
        <Button
          onClick={handleUpload}
          disabled={uploading || (!uploadedFiles.length && !selectedImage && !selectedColor && !deleteImage)}
          block
          color="success"
          style={{marginTop: '10px'}}
        >
          <b>Update Item</b>
        </Button>
      </ModalBody>
    </Modal>
    </>
  );
};
