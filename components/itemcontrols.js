import { useState } from "react";
import { FaGripVertical, FaEdit, FaTrash } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import deleteSubmission from '../hooks/deletesubmission';
import ContentEditor from "./contenteditor";

export default function ItemControls ({ contentItem, drag }) {

  if (!contentItem)
    return;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    confirmAlert({
      title: 'Delete item?',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteSubmission({contentID: contentItem.id});
              await router.replace(router.asPath, undefined, { scroll: false });
            } catch (error) {
              setError(error);
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
        zIndex: 1000
      }}>
        { drag && <button 
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
      <ContentEditor contentItem={contentItem} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

