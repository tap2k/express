import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { FaGripVertical, FaEdit, FaTrash, FaCheck, FaTimes, FaMicrophone, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import deleteSubmission from '../hooks/deletesubmission';
import updateSubmission from '../hooks/updatesubmission';
import { IconButton } from './recorderstyles';
import { getMediaInfo } from "./content";
import ContentEditor from "./contenteditor";

const Voiceover = dynamic(() => import("../components/voiceover"), { ssr: false });

export default function ItemControls ({ contentItem, privateID, jwt, dragRef, setIsModalOpen, iconSize=20, flex="row" }) {
  const router = useRouter();

  if (!contentItem || (!privateID && !jwt))
    return;

  const mediaType = getMediaInfo(contentItem).type;

  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  useEffect(() => {
    if (setIsModalOpen)
      setIsModalOpen(isEditModalOpen || isVoiceModalOpen);
  }, [isEditModalOpen, isVoiceModalOpen]);

  const moveSlide = async (increment) => {
    const contentIndex = showTitle ? currSlide - 1 : currSlide;
    if ((contentIndex + increment) < 0 || (contentIndex + increment) >= channel.contents.length) return;
    
    const contentToMove = channel.contents[contentIndex];
    if (contentToMove) {
      await updateSubmission({contentID: contentToMove.id, order: channel.contents[contentIndex + increment].order, privateID, jwt});
      const newQuery = { 
        ...router.query, 
        currslide: Math.min(currSlide + increment, showTitle ? channel.contents.length : channel.contents.length - 1)
      };
      setCurrSlide(currSlide + increment);
      await router.replace({ pathname: router.pathname, query: newQuery });
    }
  }

  const handlePublish = async () => {
    try {
      await updateSubmission({contentID: contentItem.id, published: !contentItem.publishedAt, jwt});
      await router.replace(router.asPath, undefined, { scroll: false });
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
              await router.replace(router.asPath, undefined, { scroll: false });
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
    zIndex: 1
};

  return (
    <>
      <div style={iconBarStyle}>
        { dragRef && <IconButton 
          ref={dragRef}
        >
          <FaGripVertical size={iconSize} />
        </IconButton> }
        { flex === "column" && <>
          <IconButton onClick={() => moveSlide(-1)}>
            <FaArrowLeft size={iconSize} />
          </IconButton>
          <IconButton onClick={() => moveSlide(1)}>
            <FaArrowRight size={iconSize} />
          </IconButton>
        </> }
        { mediaType.startsWith("image") && <IconButton 
          onClick={() => {
            setIsVoiceModalOpen(true);
          }} 
        >
          <FaMicrophone size={iconSize} />
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
    </>
  );
};
