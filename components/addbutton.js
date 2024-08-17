import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

export default function AddButton ({ channelID }) {
  const buttonStyle = {
    position: 'fixed',
    bottom: '25px',
    right: '10px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 128, 185, 0.6)',
    color: 'rgba(255, 255, 255, 1)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    zIndex: 1000,
  };

  return (
    <Link 
        href={`/upload?channelid=${channelID}`}
        rel="noopener noreferrer" 
        target="_blank"
        style={buttonStyle}
        onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(52, 152, 219, 1)';
            e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
        }}
        onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 128, 185, 0.6)';
            e.target.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.16)';
            e.target.style.transform = 'translateY(0) scale(1)';
        }}
    >
      <FaPlus size={18} color="white" />
    </Link>
  );
};
