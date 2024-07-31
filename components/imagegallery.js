import React from 'react';
import { imageOptions } from './fileoptions';

export default function ImageGallery({ selectedImage, setSelectedImage, showNoneOption = true }) {

  if (showNoneOption) {
    imageOptions.unshift("None");
  }

  const imageGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginBottom: '20px',
    width: '100%',
  };

  const itemStyle = {
    position: 'relative',
    aspectRatio: '1',
    overflow: 'hidden',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    border: '1px solid #ccc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const selectedOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 123, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
  };

  return (
    <div style={imageGridStyle}>
      {imageOptions.map((image, index) => (
        <div 
          key={index} 
          style={{
            ...itemStyle,
            backgroundColor: image === "None" ? '#f8f9fa' : 'transparent',
          }}
          onClick={() => setSelectedImage(image)}
        >
          {image === "None" ? (
            <span>None</span>
          ) : (
            <img 
              src={`images/${image}`} 
              alt={image} 
              style={imageStyle}
            />
          )}
          {selectedImage === image && (
            <div style={selectedOverlayStyle}>✓</div>
          )}
        </div>
      ))}
    </div>
  );
}