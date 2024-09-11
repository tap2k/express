import { FaArrowLeft } from 'react-icons/fa';
import ContentCard from './contentcard';

const zoomedContentStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  zIndex: 1000,
  overflowY: 'auto',
};

const backButtonStyle = {
  position: 'absolute',
  top: '20px',
  left: '20px',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: 'rgba(200, 200, 200, 0.5)',
  border: 'none',
  borderRadius: '50%',
  zIndex: 1000,
  transition: 'background-color 0.3s ease',
};

const contentWrapperStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '800px',
  maxHeight: '80vh',
  padding: '40px',
  boxSizing: 'border-box',
  overflowY: 'auto',
};

const zoomedCardStyle = {
  '& .card': {
    border: 'none',
    boxShadow: 'none',
    minHeight: '500px'
  },
  '& img, & video': {
    width: '100%',
    height: 'auto',
    maxHeight: '60vh',
    objectFit: 'contain',
  },
  '& .mb-2': {
    marginBottom: '0 !important',
  },
};

export default function Zoomed({ contentItem, onClose }) {
  return (
    <div style={zoomedContentStyle}>
      <button style={backButtonStyle} onClick={onClose}>
        <FaArrowLeft />
      </button>
      <div style={contentWrapperStyle}>
        <div style={zoomedCardStyle}>
          <ContentCard 
            contentItem={contentItem} 
            controls={true}
          />
        </div>
      </div>
    </div>
  );
}