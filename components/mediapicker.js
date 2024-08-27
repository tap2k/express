import { useRef, useState, useEffect } from "react";
import { Progress } from "reactstrap";
import mime from 'mime';
import getMediaURL from "../hooks/getmediaurl";
import { ButtonGroup, StyledButton } from './recorderstyles';
import { imageOptions, audioOptions } from './fileoptions';
import ImageGallery from './imagegallery';
import AudioGrid from './audiogrid';

const MediaPreview = ({ url, type, onRemove }) => {
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
            <img src={url} style={commonStyle} />
          : type.startsWith('video/') ?
            <video src={url} style={commonStyle} />
          : type.startsWith('audio/') ? 
            <audio src={url} controls style={{width: '100%'}} />
        : ""}
          <button onClick={onRemove} style={deleteStyle}>
              ✕
          </button>
      </>
  );
};

export default function MediaPicker({ mediaUrl, progress, uploadedFiles, setUploadedFiles, selectedMedia, setSelectedMedia, deleteMedia, setDeleteMedia, uploading, setUploading, accept, multiple, gallery, ...props }) {
    const [showGallery, setShowGallery] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef();

    if (mediaUrl)
      mediaUrl = getMediaURL() + mediaUrl;

    useEffect(() => {
      if (!multiple)
        setUploadedFiles([]);
    }, [selectedMedia]);

    const addFile = (e) => {
        if (!multiple)
          clearselectedMedia("");
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
    
      const clearselectedMedia = () => {
        setSelectedMedia(null);
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
      { gallery && <ButtonGroup>
        <StyledButton color="primary" onClick={() => setShowGallery(false)}>
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
          border: `2px solid ${isDragging ? '#007bff' : '#ddd'}`,
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
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
  gallery == "image" ? (
    <ImageGallery 
      imageOptions={imageOptions}
      selectedImage={selectedMedia}
      setSelectedImage={setSelectedMedia}
      uploading={uploading}
      setUploading={setUploading}
    />
  ) : gallery == "audio" ? (
    <AudioGrid             
      audioOptions={audioOptions}
      selectedAudio={selectedMedia}
      setSelectedAudio={setSelectedMedia}
    />
  ) : null
) : uploadedFiles.length > 0 ? (
  <div style={{ 
    display: 'grid', 
    gridTemplateColumns: multiple ? `repeat(auto-fill, minmax(${Math.max(90, Math.min(140, 750 / (uploadedFiles.length + (selectedMedia ? 1 : 0))))}px, 1fr))` : '100%',
    gap: '12px', 
    width: '100%',
    height: '100%',
    padding: '6px',
  }}>
    {uploadedFiles.map((file, index) => {
      const url = URL.createObjectURL(file);
      const type = file.type;
      return (
        <div key={index} style={{ position: 'relative'}}>
          <MediaPreview url={url} type={type} onRemove={() => removeFile(index)} />
        </div>
      );
    })}
  </div>
) : mediaUrl && !deleteMedia ? (
  <div style={{ display: 'inline-block', position: 'relative', maxWidth: '100%' }}>
    <MediaPreview url={mediaUrl} type={mime.getType(mediaUrl)} onRemove={() => setDeleteMedia(true)} /> 
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