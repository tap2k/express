import { useState, useRef } from "react";
import { Progress } from "reactstrap";
import mime from 'mime';
import getMediaURL from "../hooks/getmediaurl";
import { StyledButton } from './recorderstyles';
import MediaPreview from "./mediapreview";

export default function UploadWidget({ mediaUrl, progress, uploadedFiles, setUploadedFiles, deleteMedia, setDeleteMedia, accept, multiple }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef();
  
    if (mediaUrl) {
      mediaUrl = getMediaURL() + mediaUrl;
    }
  
    const addFile = (e) => {
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
    
    return (
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{width: '100%', minHeight: '300px', backgroundColor: isDragging ? 'rgba(0, 123, 255, 0.1)' : 'transparent', border: `2px solid ${isDragging ? '#007bff' : '#ddd'}`, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      >
        {uploadedFiles.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: multiple ? `repeat(auto-fill, minmax(${Math.max(90, Math.min(140, 750 / (uploadedFiles.length)))}px, 1fr))` : '100%',
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
    );
}