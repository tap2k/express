import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { FaGripVertical, FaEdit, FaTrash, FaCheck, FaTimes, FaMicrophone, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import deleteSubmission from '../hooks/deletesubmission';
import updateSubmission from '../hooks/updatesubmission';
import { getMediaInfo } from "./content";
import ContentEditor from "./contenteditor";

const Voiceover = dynamic(() => import("../components/voiceover"), { ssr: false });

export default function ItemControls ({ contentItem, privateID, jwt, dragRef, setIsModalOpen, iconSize=20, flexDirection="row" }) {
  const router = useRouter();

  if (!contentItem || (!privateID && !jwt))
    return;

  const mediaType = getMediaInfo(contentItem).type;

  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  useEffect(() => {
    if (setIsModalOpen)
      setIsModalOpen(isEditModalOpen || isVoiceModalOpen)
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

  const iconColor = "rgba(0, 0, 0, 0.5)";

  const iconButtonStyle = { 
    background: 'rgba(255, 255, 255, 0.5)', 
    border: 'none', 
    borderRadius: '50%', 
    padding: '5px' 
  }

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 5,
        right: 5,
        display: 'flex',
        flexDirection: flexDirection,
        gap: iconSize/3,
        zIndex: 1
      }}>
        { dragRef && <button 
          ref={dragRef}
          style={iconButtonStyle}
        >
          <FaGripVertical size={iconSize} color={iconColor} />
        </button> }
        { flexDirection === "column" && <>
          <button onClick={() => moveSlide(-1)} style={iconButtonStyle}>
            <FaArrowLeft size={iconSize} color={iconColor} />
          </button>
          <button onClick={() => moveSlide(1)} style={iconButtonStyle}>
            <FaArrowRight size={iconSize} color={iconColor} />
          </button>
        </> }
        { mediaType.startsWith("image") && <button 
          onClick={() => {
            setIsVoiceModalOpen(true);
          }} 
          style={iconButtonStyle}
        >
          <FaMicrophone size={iconSize} color={iconColor} />
        </button> }
        <button 
          onClick={() => {
            setisEditModalOpen(true);
          }} 
          style={iconButtonStyle}
        >
          <FaEdit size={20} color={iconColor} />
        </button>
        <button 
          onClick={handlePublish} 
          style={iconButtonStyle}
        >
          {contentItem.publishedAt ? 
            <FaTimes size={iconSize} color={iconColor} /> : 
            <FaCheck size={iconSize} color={iconColor} />
          }
        </button>
        <button 
          onClick={handleDelete} 
          style={iconButtonStyle}
        >
          <FaTrash size={iconSize} color={iconColor} />
        </button>
      </div>
      <ContentEditor contentItem={contentItem} isEditModalOpen={isEditModalOpen} setisEditModalOpen={setisEditModalOpen} privateID={privateID} jwt={jwt} />
      <Voiceover contentItem={contentItem} isModalOpen={isVoiceModalOpen} setisModalOpen={setIsVoiceModalOpen} privateID={privateID} jwt={jwt} />
    </>
  );
};
