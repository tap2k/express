// components/playicon.js

export default function PlayIcon({ inverted = false }) {
  const iconStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '20%',
    maxWidth: 200,
    pointerEvents: 'none'
  };

  if (inverted) {
    iconStyle.filter = 'invert(100%) grayscale(100%)';
    iconStyle.mixBlendMode = 'difference';
  }

  return (
    <img 
      src="playicon.png" 
      style={iconStyle}
      alt="Play"
    />
  );
}