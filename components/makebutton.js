import Link from 'next/link';

export default function MakeButton() {
  const buttonStyle = {
    backgroundColor: 'rgba(41, 128, 185, 0.8)',
    color: 'rgba(255, 255, 255, 1)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: 'calc(0.8vmin + 0.6em)',
    padding: '12px 24px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16)',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  };

  const containerStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1000
  };

  return (
    <div style={containerStyle}>
      <Link href="/" rel="noopener noreferrer" target="_blank">
        <button 
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(52, 152, 219, 1)';
            e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(41, 128, 185, 0.8)';
            e.target.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.16)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Make your own!
        </button>
      </Link>
    </div>
  );
};

