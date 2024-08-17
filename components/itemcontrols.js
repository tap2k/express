import { FaGripVertical, FaTrash } from 'react-icons/fa';

export default function itemControls ({ onDelete, contentID }) {
  return (
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
          background: 'rgba(255, 255, 255, 0.5)', 
          border: 'none', 
          borderRadius: '50%', 
          padding: '5px',
          cursor: 'move'
        }}
      >
        <FaGripVertical size={20} color="rgba(0, 0, 0, 0.5)" />
      </button>
      <button 
        onClick={() => onDelete(contentID)} 
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
  );
};

