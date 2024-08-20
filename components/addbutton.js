import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

export default function AddButton({ channelID }) {
  const buttonStyle = {
    position: 'fixed',
    bottom: '15px',
    right: '10px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(92, 131, 156, 0.6)',
    color: 'rgba(240, 240, 240, 1)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.05)',
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
        e.target.style.backgroundColor = 'rgba(92, 131, 156, 0.8)';
        e.target.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.15)';
        e.target.style.transform = 'translateY(-1px) scale(1.03)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'rgba(92, 131, 156, 0.6)';
        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        e.target.style.transform = 'translateY(0) scale(1)';
      }}
    >
      <FaPlus color="rgba(240, 240, 240, 1)" />
    </Link>
  );
}
