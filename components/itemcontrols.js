import { useState } from "react";
import { useRouter } from 'next/router';
import { FaGripVertical, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import deleteSubmission from '../hooks/deletesubmission';
import updateSubmission from '../hooks/updatesubmission';
import ContentEditor from "./contenteditor";

export default function ItemControls ({ contentItem, privateID, dragRef }) {
  const router = useRouter();

  if (!contentItem || !privateID)
    return;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePublish = async () => {
    try {
      await updateSubmission({contentID: contentItem.id, published: !contentItem.publishedAt});
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
              await deleteSubmission({contentID: contentItem.id, privateID: privateID});
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

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 5,
        right: 5,
        display: 'flex',
        gap: '5px',
        zIndex: 90
      }}>
        { dragRef && <button 
          ref={dragRef}
          style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            border: 'none', 
            borderRadius: '50%', 
            padding: '5px',
            cursor: 'move'
          }}
        >
          <FaGripVertical size={20} color="rgba(0, 0, 0, 0.5)" />
        </button> }
        <button 
          onClick={handlePublish} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            border: 'none', 
            borderRadius: '50%', 
            padding: '5px' 
          }}
        >
          {contentItem.publishedAt ? 
            <FaTimes size={20} color="rgba(0, 0, 0, 0.5)" /> : 
            <FaCheck size={20} color="rgba(0, 0, 0, 0.5)" />
          }
        </button>
        <button 
          onClick={() => {
            setIsModalOpen(true);
          }} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            border: 'none', 
            borderRadius: '50%', 
            padding: '5px' 
          }}
        >
          <FaEdit size={20} color="rgba(0, 0, 0, 0.5)"/>
        </button>
        <button 
          onClick={handleDelete} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            border: 'none', 
            borderRadius: '50%', 
            padding: '5px' 
          }}
        >
          <FaTrash size={20} color="rgba(0, 0, 0, 0.5)" />
        </button>
      </div>
      <ContentEditor contentItem={contentItem} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} privateID={privateID} />
    </>
  );
};
