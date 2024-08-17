import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { StyledButton } from './recorderstyles';

export default function ImageGallery({ imageOptions, selectedImage, setSelectedImage }) {
  const [isGeneratingDalle, setIsGeneratingDalle] = useState(false);
  const [dalleImage, setDalleImage] = useState(null);
  const [columns, setColumns] = useState(6);
  const dallePromptRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setColumns(3);
      } else if (window.innerWidth < 900) {
        setColumns(4);
      } else {
        setColumns(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const imageGridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridAutoRows: 'min-content',
    gap: '10px',
    marginBottom: '10px',
    width: '100%',
    alignContent: 'start'
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
    padding: '5px',
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

  const dalleContainerStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const dallePromptStyle = {
    width: '100%',
    height: 40,
    padding: '5px 10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginTop: '10px',
    marginBottom: '10px',
  };

  const handleDalleGeneration = async () => {
    if (!dallePromptRef.current?.value)
      return;
    setIsGeneratingDalle(true);
    try {
      const response = await axios.post('/api/dalle', {
        prompt: dallePromptRef.current.value
      });

      const imageBase64 = response.data.imageBase64;
      const dataUri = `data:image/png;base64,${imageBase64}`;

      setDalleImage(dataUri);
      setSelectedImage(dataUri);
    } catch (error) {
      console.error('Error generating DALL-E image:', error);
      alert('Failed to generate AI image. Please try again.');
    } finally {
      setIsGeneratingDalle(false);
    }
  };

  return (
    <>
      {dalleImage ? (
        <div 
          style={itemStyle}
          onClick={() => setSelectedImage(dalleImage)}
        >
          <img 
            src={dalleImage} 
            alt="DALL-E generated" 
            style={{...imageStyle, objectFit: "contain", height: '90%'}}
          />
        </div>
      ) : (
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
      )}

      <div style={dalleContainerStyle}>
        <input 
          type="text" 
          ref={dallePromptRef}
          placeholder="Enter AI prompt"
          style={dallePromptStyle}
        />
        <StyledButton 
          color="info" 
          onClick={handleDalleGeneration}
          disabled={isGeneratingDalle}
          style={{ width: '100%'}}
        >
          {isGeneratingDalle ? 'Generating...' : 'Generate AI Image'}
        </StyledButton>
      </div>
    </>
  );
}
