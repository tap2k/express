import { FaArrowLeft } from 'react-icons/fa';
import Content from './content';

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
  width: '80vw',
  maxWidth: '1200px', // Add a maximum width
  height: '80vh',
  maxHeight: '800px', // Add a maximum height
  padding: '40px',
  boxSizing: 'border-box',
  overflow: 'auto', // Add scroll if content exceeds wrapper size
};

export default function Zoomed({ contentItem, onClose }) {
  return (
    <div style={zoomedContentStyle}>
      <button style={backButtonStyle} onClick={onClose}>
        <FaArrowLeft />
      </button>
      <div style={contentWrapperStyle}>
        <Content 
          contentItem={contentItem}
          height="auto"
          caption={contentItem.mediafile?.url?.includes("maustrocard") || contentItem.background_color}
        />
      </div>
    </div>
  );
}