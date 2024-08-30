import { useState, useRef } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import ImageGrid from './imagegrid';

export default function ImageGallery({ imageOptions, selectedImage, setSelectedImage, uploading, setUploading, setProgress }) {
  const [dalleImage, setDalleImage] = useState(null);
  const dallePromptRef = useRef(null);

  const simulateProgress = () => {
    if (!setProgress)
      return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 90) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 10;
      });
    }, 500);
    return interval;
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

    if (setUploading)
      setUploading(true);
    if (setProgress)
      setProgress(0);

    const progressInterval = simulateProgress();
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
      if (setUploading)
        setUploading(false);
      if (setProgress)
        setProgress(0);
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
        <Button
          color="info"
          onClick={handleDalleGeneration}
          disabled={uploading}
          style={{ width: '100%', marginTop: '10px'}}
        >
          {uploading ? 'Generating...' : 'Generate AI Image'}
        </Button>
      </div>
    </>
  );
}
