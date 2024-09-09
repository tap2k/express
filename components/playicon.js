
export default function PlayIcon({ isPlaying, toggle, inverted = false }) {
  
  const containerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '20%',
    maxWidth: 200,
    aspectRatio: '1 / 1', 
    zIndex: 100,
    cursor: 'pointer',
    opacity: 0.9
  };

  const iconStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  if (inverted) {
    iconStyle.filter = 'invert(100%) grayscale(100%)';
    iconStyle.mixBlendMode = 'difference';
  }

  return (
    <div style={containerStyle} onClick={toggle}>
      <div style={iconStyle}>
        {!isPlaying && (
          <img
            src="playicon.png"
            style={{ width: '60%' }}
            alt="Play"
          />
        )}
      </div>
    </div>
  );
}