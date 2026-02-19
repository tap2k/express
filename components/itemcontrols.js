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

export default function ItemControls ({ contentItem, privateID, jwt, dragRef, moveSlide, setIsModalOpen, publisher, tagger, iconSize=20, flex="row" }) {

  if (!contentItem || (!privateID && !jwt))
    return;

  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(contentItem?.background_color);
  const [selectedForegroundColor, setSelectedForegroundColor] = useState(contentItem?.foreground_color);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const router = useRouter();
  const type = getMediaInfo(contentItem).type;

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
    await updateSubmission({contentID: contentItem.id, myFormData: myFormData, backgroundColor: selectedBackgroundColor, foregroundColor: selectedForegroundColor, deleteMedia: deleteImage, setProgress, privateID, jwt});
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
    gap: '5px',
    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
    opacity: 1,
    visibility: 'visible',
    zIndex: 100
  };

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle} title="Close">&times;</button>
  );

  return (
    <>
      <div style={iconBarStyle}>
        { dragRef && <IconButton
          ref={dragRef}
          title="Drag to reorder"
        >
          <FaGripVertical size={iconSize} />
        </IconButton> }
        { moveSlide && <>
          <IconButton onClick={() => moveSlide(-1)} title="Move left">
            <FaArrowLeft size={iconSize} />
          </IconButton>
          <IconButton onClick={() => moveSlide(1)} title="Move right">
            <FaArrowRight size={iconSize} />
          </IconButton>
        </> }
        { (type.startsWith("image") || type.startsWith("text") || !type) && <IconButton
          onClick={() => {
            setIsVoiceModalOpen(true);
          }}
          title="Add voiceover"
        >
          <FaMicrophone size={iconSize} />
        </IconButton> }
        {((type.startsWith("image") && (contentItem.mediafile?.url.indexOf("maustrocard") != -1)) || !type || type.startsWith("text") || type.startsWith("audio")) && <IconButton
          onClick={() => {
            setIsImageModalOpen(true);
          }}
          title="Change image"
        >
          <FaImage size={iconSize} />
        </IconButton> }
        <IconButton
          onClick={() => {
            setisEditModalOpen(true);
          }}
          title="Edit item"
        >
          <FaEdit size={iconSize} />
        </IconButton>
        {publisher && <IconButton
          onClick={handlePublish}
          title={contentItem.publishedAt ? "Unpublish" : "Publish"}
        >
          {contentItem.publishedAt ?
            <FaTimes size={iconSize} /> :
            <FaCheck size={iconSize} />
          }
        </IconButton>}
        {jwt && <IconButton
          onClick={handleDelete}
          title="Delete item"
        >
          <FaTrash size={iconSize} />
        </IconButton>}
      </div>
      <ContentEditor contentItem={contentItem} isModalOpen={isEditModalOpen} setIsModalOpen={setisEditModalOpen} privateID={privateID} jwt={jwt} tagger={tagger} />
      <Voiceover contentItem={contentItem} isModalOpen={isVoiceModalOpen} setIsModalOpen={setIsVoiceModalOpen} privateID={privateID} jwt={jwt} />
      <Modal isOpen={isImageModalOpen} toggle={() => {setIsImageModalOpen(false)}}>
        <ModalHeader close={closeBtn(() => setIsImageModalOpen(false))}></ModalHeader>
        <ModalBody>
          <MediaPicker mediaUrl={type.startsWith("image") && contentItem.mediafile?.url} progress={progress} setProgress={setProgress} generating={uploading} setGenerating={setUploading} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} selectedBackgroundColor={selectedBackgroundColor} setSelectedBackgroundColor={setSelectedBackgroundColor} selectedForegroundColor={selectedForegroundColor} setSelectedForegroundColor={setSelectedForegroundColor} selectedMedia={selectedImage} setSelectedMedia={setSelectedImage} deleteMedia={deleteImage} setDeleteMedia={setDeleteImage} accept="image/*" gallery="image" dalle />
          <Button
            onClick={handleUpload}
            disabled={uploading || (!uploadedFiles.length && !selectedImage && !selectedBackgroundColor && !deleteImage)}
            block
            color="success"
            style={{marginTop: '10px'}}
            title="Update item"
          >
            <b>Update Item</b>
          </Button>
        </ModalBody>
        </Modal>
    </>
  );
};
