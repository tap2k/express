import { useRouter } from 'next/router';
import { useRef, useState } from "react";
import { Input, Button, Progress } from "reactstrap";
import useGeolocation from "react-hook-geolocation";
import uploadSubmission from "../hooks/uploadsubmission";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from './recorderstyles';
import ImageGallery from './imagegallery';

export default function Uploader({ channelID, useLocation, ...props }) {
  const router = useRouter();
  const fileInputRef = useRef();
  const [progress, setProgress] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const descriptionRef = useRef();
  const extUrlRef = useRef();

  let lat = null;
  let long = null;

  if (useLocation) {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  const imageOptions = ["flowers5.png", "flowers6.png", "clouds.png", "flowers4.jpg", "meadow.jpg", "robin.jpg", "trees.jpg"];

  const uploadContent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (selectedImage && selectedImage !== "None") {
        const response = await fetch(`images/${selectedImage}`);
        const blob = await response.blob();
        formData.append('mediafile', blob, selectedImage);
      } else if (uploadedFiles.length > 0) {
        uploadedFiles.forEach(file => formData.append('mediafile', file));
      }
      await uploadSubmission({
        myFormData: formData, 
        channelID, 
        lat, 
        long, 
        description: descriptionRef.current.value, 
        ext_url: extUrlRef.current.value, 
        published: true, 
        setProgress, 
        router
      }); 
      setSelectedImage(null);
      setUploadedFiles([]);
      setProgress(0);
      descriptionRef.current.value = "";
      extUrlRef.current.value = "";
    }
    catch (error) {
      console.error('Error uploading content:', error);
      setErrorText('Failed to upload content. Please try again.');
    }
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
    setSelectedImage(null);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
  };

  return (
    <RecorderWrapper {...props}>
      <ButtonGroup>
        <StyledButton color="primary" onClick={() => {setShowGallery(false); /*fileInputRef.current.click()*/}}>
          Select Files
        </StyledButton>
        <StyledButton color="info" onClick={() => setShowGallery(true)}>
          Show Gallery
        </StyledButton>
        {/* <StyledButton 
          color="secondary" 
          onClick={() => {
            setSelectedImage(null);
            setUploadedFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }} 
          disabled={!selectedImage && uploadedFiles.length === 0}
        >
          Clear All
        </StyledButton> */}
      </ButtonGroup>

      <div
        style={{
          width: '100%',
          minHeight: '350px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: (showGallery || selectedImage || uploadedFiles.length > 0) ? 'start' : 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'auto',
          padding: '10px',
        }}
      >
        {showGallery ? (
          <ImageGallery 
            imageOptions={imageOptions}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        ) : selectedImage || uploadedFiles.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(90, Math.min(140, 750 / (uploadedFiles.length + (selectedImage ? 1 : 0))))}px, 1fr))`,
            gap: '12px', 
            width: '100%',
            height: '100%',
            padding: '6px',
          }}>
            {selectedImage && (
              <div style={{ position: 'relative', aspectRatio: '1 / 1' }}>
                <img 
                  src={`images/${selectedImage}`} 
                  alt={selectedImage} 
                  style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}}
                />
                <button
                  onClick={clearSelectedImage}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  ✕
                </button>
              </div>
            )}
            {uploadedFiles.map((file, index) => (
              <div key={index} style={{ position: 'relative', aspectRatio: '1 / 1' }}>
                {file.type.startsWith('image/') && (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={file.name} 
                    style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}}
                  />
                )}
                {file.type.startsWith('video/') && (
                  <video src={URL.createObjectURL(file)} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}} />
                )}
                {file.type.startsWith('audio/') && (
                  <audio src={URL.createObjectURL(file)} controls style={{width: '100%'}} />
                )}
                <button
                  onClick={() => removeFile(index)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center'}}>
            <p>No files selected</p>
            <StyledButton
              color="secondary"
              onClick={() => fileInputRef.current.click()}
            >
              Select Files
            </StyledButton>
          </div>
        )}
      </div>
      <Progress value={progress} style={{marginBottom: 20}}  />
      
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept="image/*,audio/*,video/*"
        onChange={handleFileUpload}
        multiple
      />
      
      <Input
        type="text"
        innerRef={descriptionRef}
        placeholder="Enter text"
        style={{
          width: '100%',
          marginBottom: '10px'
        }}
      />
      <Input
        type="text"
        innerRef={extUrlRef}
        placeholder="Enter URL"
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <Button
        color="success"
        onClick={uploadContent}
        block
      >
        Submit
      </Button>
    </RecorderWrapper>
  );
}
