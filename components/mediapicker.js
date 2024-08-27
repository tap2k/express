import { useState, useEffect } from "react";
import { ButtonGroup, StyledButton } from './recorderstyles';
import { imageOptions, audioOptions } from './fileoptions';
import ImageGallery from './imagegallery';
import AudioGrid from './audiogrid';
import UploadWidget from "./uploadwidget";

export default function MediaPicker({ mediaUrl, progress, uploadedFiles, setUploadedFiles, selectedMedia, setSelectedMedia, deleteMedia, setDeleteMedia, uploading, setUploading, accept, multiple, gallery, ...props }) {
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    if (!multiple)
      setUploadedFiles([]);
  }, [selectedMedia]);

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
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '5px',
        }}
      >
        {showGallery ? (
          gallery === "image" ? (
            <ImageGallery 
              imageOptions={imageOptions}
              selectedImage={selectedMedia}
              setSelectedImage={setSelectedMedia}
              uploading={uploading}
              setUploading={setUploading}
            />
          ) : gallery === "audio" ? (
            <AudioGrid             
              audioOptions={audioOptions}
              selectedAudio={selectedMedia}
              setSelectedAudio={setSelectedMedia}
            />
          ) : null
        ) : 
          <UploadWidget
            mediaUrl={mediaUrl} 
            progress={progress}
            uploadedFiles={uploadedFiles} 
            setUploadedFiles={setUploadedFiles}
            deleteMedia={deleteMedia}
            setDeleteMedia={setDeleteMedia}
            accept={accept} 
            multiple={multiple}
          />
        }
      </div>
    </div>
  );
}