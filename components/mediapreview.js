import React from 'react';

export default function MediaPreview({ url, type, onRemove }) {
  const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: '4px',
  };

  const mediaStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '4px',
  };

  const deleteStyle = {
    position: 'absolute',
    top: '5px',
    right: '5px',
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
    zIndex: 10,
  };

  let mediaElement;
  if (type.startsWith('image/')) {
    mediaElement = <img src={url} alt="Preview" style={mediaStyle} />;
  } else if (type.startsWith('video/')) {
    mediaElement = 
      <>
        <video src={url} style={mediaStyle} />;
      </>
  } else if (type.startsWith('audio/')) {
    mediaElement = <audio src={url} controls style={{ width: '100%', maxWidth: '300px' }} />;
  }

  return (
    <div style={containerStyle}>
      {mediaElement}
      <button onClick={onRemove} style={deleteStyle}>
        ✕
      </button>
    </div>
  );
}