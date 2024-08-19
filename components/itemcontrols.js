import { useState } from "react";
import { FaGripVertical, FaEdit, FaTrash } from 'react-icons/fa';
import ContentEditor from "./contenteditor";

export default function itemControls ({ contentItem, onDelete }) {

  if (!contentItem)
    return;

  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
        <button 
          style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            border: 'none', 
            borderRadius: '50%', 
            padding: '5px',
            cursor: 'move'
          }}
        >
          <FaGripVertical size={20} color="rgba(0, 0, 0, 0.5)" />
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
          onClick={() => onDelete(contentItem.id)} 
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

