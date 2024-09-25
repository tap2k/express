import { useState, useRef, useEffect } from "react";
import { Progress } from "reactstrap";
import mime from 'mime';
import getMediaURL from "../hooks/getmediaurl";
import { StyledButton } from './recorderstyles';
import MediaPreview from "./mediapreview";

export default function UploadWidget({ mediaUrl, progress, uploadedFiles, setUploadedFiles, setDeleteMedia, accept, multiple, text, dontShowFiles, ...props }) {
    const [isDragging, setIsDragging] = useState(false);
    const [localDelete, setLocalDelete] = useState(false);
    const fileInputRef = useRef();
    
    if (!text)
      text = 'Drop files here, or';
  
    if (mediaUrl) {
      mediaUrl = getMediaURL() + mediaUrl;
    }

    useEffect(() => {
      if (setDeleteMedia)
        setDeleteMedia(localDelete);
    }, [localDelete]);
  
  
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
        style={{width: '100%', minHeight: '300px', backgroundColor: isDragging ? 'rgba(0, 123, 255, 0.1)' : 'transparent', border: `2px solid ${isDragging ? '#007bff' : '#ddd'}`, display: 'flex', justifyContent: 'center', alignItems: 'center', ...props.style}}
      >
        {uploadedFiles?.length > 0 && !dontShowFiles ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: multiple ? `repeat(auto-fill, minmax(${Math.max(120, Math.min(200, 750 / (uploadedFiles?.length)))}px, 1fr))` : '100%',
            gap: '12px', 
            width: '100%',
            height: '100%',
            padding: '6px',
          }}>
            {uploadedFiles.map((file, index) => {
              const url = URL.createObjectURL(file);
              const type = file.type;
              return (
                <div key={index} style={{ 
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}>
                  <MediaPreview url={url} type={type} onRemove={() => removeFile(index)} />
                </div>
              );
            })}
          </div>
        ) : mediaUrl && !localDelete ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%', 
                margin: '0 auto', 
                position: 'relative' 
              }}>
                <MediaPreview 
                  url={mediaUrl} 
                  type={mime.getType(mediaUrl) || ""} 
                  onRemove={() => {setLocalDelete(true)}} 
                /> 
              </div>
        ) : (
          <div style={{ textAlign: 'center'}}>
            <p>{text}</p>
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