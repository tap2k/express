
export default function MediaPreview ({ url, type, onRemove }) {
  const deleteStyle = {
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: 'rgba(0,0,0,0.5)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '25px',
      height: '25px',
      cursor: 'pointer',
  };

  const commonStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '4px',
      maxHeight: '300px',
  };

  return (
    <>
      {type.startsWith('image/') ? 
        <img src={url} style={{ ...commonStyle, maxWidth: '100%', height: 'auto' }} />
      : type.startsWith('video/') ?
        <video src={url} style={{ ...commonStyle, maxWidth: '100%', height: 'auto' }} />
      : type.startsWith('audio/') ? 
        <audio src={url} controls style={{ width: '100%', maxWidth: '500px', display: 'block', margin: '0 auto' }} />
      : null}
      <button 
        onClick={onRemove} 
        style={{
          ...deleteStyle,
          position: 'absolute',
          top: '1px',
          right: '1px',
          background: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        ✕
      </button>
    </>
  );
};