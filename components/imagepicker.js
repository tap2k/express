import { useRef, useState, useEffect } from "react";
import { Progress } from "reactstrap";
import getMediaURL from "../hooks/getmediaurl";
import { ButtonGroup, StyledButton } from './recorderstyles';
import { imageOptions } from './fileoptions';
import ImageGallery from './imagegallery';

export default function ImagePicker({ imageUrl, progress, uploadedFiles, setUploadedFiles, selectedImage, setSelectedImage, deletePic, setDeletePic, accept, multiple, ...props }) {
    const [showGallery, setShowGallery] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef();

    if (imageUrl)
      imageUrl = getMediaURL() + imageUrl;

    useEffect(() => {
      if (!multiple)
        setUploadedFiles([]);
    }, [selectedImage]);

    const addFile = (e) => {
        if (!multiple)
          clearSelectedImage("");
        const newFiles = Array.from(e.target.files).filter(file => 
          file.type.startsWith('image/') || 
          file.type.startsWith('video/') || 
          file.type.startsWith('audio/')
        );
        setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
      };
    
      const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
      };
    
      const clearSelectedImage = () => {
        setSelectedImage(null);
      };
    
      const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
      };
    
      const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
      };
    
      const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
    
      const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files).filter(file => 
          file.type.startsWith('image/') || 
          file.type.startsWith('video/') || 
          file.type.startsWith('audio/')
        );
        setUploadedFiles(prevFiles => [...prevFiles, ...files]);
      };

      const deleteStyle = {
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
      };

return (
    <div {...props}>
      <ButtonGroup>
        <StyledButton color="primary" onClick={() => setShowGallery(false)}>
          Select Files
        </StyledButton>
        <StyledButton color="info" onClick={() => setShowGallery(true)}>
          Show Gallery
        </StyledButton>
      </ButtonGroup>

      <div
        style={{
          width: '100%',
          minHeight: '300px',
          border: `2px solid ${isDragging ? '#007bff' : '#ddd'}`,
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: (showGallery || (selectedImage + uploadedFiles.length > 1)) ? 'start' : 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '10px',
          backgroundColor: isDragging ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
            {selectedImage && selectedImage != "None" && (
              <div style={{ position: 'relative', aspectRatio: '1 / 1' }}>
                <img 
                  src={selectedImage.startsWith('data:image/png;base64,') ? selectedImage : `images/${selectedImage}`} 
                  alt={selectedImage}
                  style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px'}}
                />
                <button
                  onClick={clearSelectedImage}
                  style={deleteStyle}
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
                  style={deleteStyle}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : imageUrl && !deletePic ? (
          <div style={{ display: 'inline-block', position: 'relative', maxWidth: '100%' }}>
              <img 
                  src={imageUrl} 
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    height: '300px',
                      objectFit: 'contain',
                      marginBottom: '10px'
                  }}
              />
              <button
                  onClick={() => setDeletePic(true)}
                  style={deleteStyle}
              >
                  ✕
              </button>
          </div>
          ) : (
          <div style={{ textAlign: 'center'}}>
            <p>Drop files here, or</p>
            <StyledButton
              color="secondary"
              onClick={() => fileInputRef.current.click()}
            >
              Select Files
            </StyledButton>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept={accept}
        onChange={addFile}
        multiple={multiple}
      />
      <Progress value={progress} />
    </div>
)}