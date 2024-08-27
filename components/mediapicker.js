import { useState, useEffect } from "react";
import { ButtonGroup, StyledButton } from './recorderstyles';
import ImageGallery from './imagegallery';
import AudioGrid from './audiogrid';
import UploadWidget from "./uploadwidget";

export default function MediaPicker({ mediaUrl, progress, uploadedFiles, setUploadedFiles, selectedMedia, setSelectedMedia, deleteMedia, setDeleteMedia, uploading, setUploading, accept, multiple, gallery, ...props }) {
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    if (!multiple)
      setUploadedFiles([]);
  }, [selectedMedia]);

  useEffect(() => {
    if (!multiple && uploadedFiles.length)
      setSelectedMedia(null);
  }, [uploadedFiles]);

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
      {showGallery ? (
        gallery === "image" ? (
          <>
          <ImageGallery 
            selectedImage={selectedMedia}
            setSelectedImage={setSelectedMedia}
            uploading={uploading}
            setUploading={setUploading}
          />
          </>
        ) : gallery === "audio" ? (
          <AudioGrid             
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
  );
}