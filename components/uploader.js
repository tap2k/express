import { useRouter } from 'next/router';
import { useRef, useState } from "react";
import { Button, Progress } from "reactstrap";
import uploadSubmission from "../hooks/uploadsubmission";
import setError from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from './recorderstyles';
import { imageOptions } from './fileoptions';
import ImageGallery from './imagegallery';
import ContentInputs from "./contentinputs";

export default function Uploader({ channelID, uploading, setUploading, lat, long, ...props }) {
  const router = useRouter();
  const fileInputRef = useRef();
  const [progress, setProgress] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const titleRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const locationRef = useRef();
  const extUrlRef = useRef();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (setUploading)
      setUploading(true);
    
    try {
      const formData = new FormData();

      if (selectedImage && selectedImage !== "None") {
        if (selectedImage.startsWith('data:image/png;base64,')) {
          // This is a DALL-E generated image
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          formData.append('dalle-image.png', blob, 'dalle-image.png');
        } else {
          // This is a regular gallery image
          const response = await fetch(`images/${selectedImage}`);
          const blob = await response.blob();
          formData.append(selectedImage, blob, "maustrocard-"+selectedImage);
        }
      }
      
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach(file => formData.append(file.name, file, file.name));
      }
      
      await uploadSubmission({
        myFormData: formData, 
        channelID, 
        lat, 
        long, 
        title: titleRef?.current?.value,
        name: nameRef?.current?.value,
        email: emailRef?.current?.value,
        location: locationRef?.current?.value,
        ext_url: extUrlRef?.current?.value, 
        published: true, 
        setProgress, 
        router
      }); 
      
      setSelectedImage(null);
      setUploadedFiles([]);
      setProgress(0);
      if (titleRef.current)
        titleRef.current.value = "";
      if (nameRef.current)
        nameRef.current.value = "";
      if (emailRef.current)
        emailRef.current.value = "";
      if (locationRef.current)
        locationRef.current.value = "";
      if (extUrlRef.current)
        extUrlRef.current.value = "";
    }
    catch (error) {
      console.error('Error uploading content:', error);
      setError('Failed to upload content. Please try again.');
    }

    if (setUploading)
      setUploading(false);
  }

  const addFile = (e) => {
    const newFiles = Array.from(e.target.files);
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
  };

  return (
    <RecorderWrapper {...props}>
      { false && <ButtonGroup>
        <StyledButton color="primary" onClick={() => {if (showGallery) setShowGallery(false); else fileInputRef.current.click()}}>
          Select Files
        </StyledButton>
        <StyledButton color="info" onClick={() => setShowGallery(true)}>
          Show Gallery
        </StyledButton>
      </ButtonGroup> }

      <div
        style={{
          width: '100%',
          minHeight: '300px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: (showGallery || selectedImage || uploadedFiles.length > 0) ? 'start' : 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden', // Changed from 'auto' to 'hidden'
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
                  src={selectedImage.startsWith('data:image/png;base64,') ? selectedImage : `images/${selectedImage}`} 
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
        onChange={addFile}
        multiple
      />
      
      <ContentInputs style={{marginBottom: '20px'}} titleRef={titleRef} nameRef={nameRef} emailRef={emailRef} locationRef={locationRef} extUrlRef={extUrlRef}  />

      <Button
        color="success"
        onClick={handleUpload}
        block
        disabled={uploading}
      >
        Submit
      </Button>
    </RecorderWrapper>
  );
}
