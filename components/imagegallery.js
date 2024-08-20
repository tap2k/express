import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { StyledButton } from './recorderstyles';
import ImageGrid from './imagegrid';

export default function ImageGallery({ imageOptions, selectedImage, setSelectedImage }) {
  const [isGeneratingDalle, setIsGeneratingDalle] = useState(false);
  const [dalleImage, setDalleImage] = useState(null);
  const [columns, setColumns] = useState(6);
  const dallePromptRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setColumns(4);
      } else {
        setColumns(4);
      } 
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        <div style={{ flex: 1, width: '100%', overflowY: 'auto', marginBottom: '10px' }}>
        {dalleImage ? (
          <div style={itemStyle} onClick={() => setSelectedImage(dalleImage)}>
            <img
              src={dalleImage}
              alt="DALL-E generated"
              style={{...imageStyle, objectFit: "contain", height: '90%'}}
            />
          </div>
        ) : (
          <ImageGrid
            imageOptions={imageOptions}
            columns={columns}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        )}
      </div>
      
      <div style={{...dalleContainerStyle, width: '100%'}}>
        <input
          type="text"
          ref={dallePromptRef}
          placeholder="Enter AI prompt"
          style={{...dallePromptStyle, width: '100%'}}
        />
        <StyledButton
          color="info"
          onClick={handleDalleGeneration}
          disabled={isGeneratingDalle}
          style={{ width: '100%', marginTop: '10px'}}
        >
          {isGeneratingDalle ? 'Generating...' : 'Generate AI Image'}
        </StyledButton>
      </div>
    </>
  );
}
