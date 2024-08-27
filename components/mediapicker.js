import { useState, useEffect } from "react";
import { ButtonGroup, StyledButton } from './recorderstyles';
import { imageOptions, audioOptions, colorOptions } from './fileoptions';
import ImageGallery from './imagegallery';
import AudioGrid from './audiogrid';
import ColorGrid from './colorgrid';
import UploadWidget from "./uploadwidget";

export default function MediaPicker({ mediaUrl, progress, uploadedFiles, setUploadedFiles, selectedColor, setSelectedColor, selectedMedia, setSelectedMedia, deleteMedia, setDeleteMedia, uploading, setUploading, accept, multiple, gallery, ...props }) {
  const [showGallery, setShowGallery] = useState(false);
  const [showColors, setShowColors] = useState(false);

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
      { (gallery || setSelectedColor) && <ButtonGroup>
        <StyledButton color="primary" onClick={() => {setShowColors(false); setShowGallery(false)}}>
          Upload
        </StyledButton>
        { gallery && <StyledButton color="info" onClick={() => {setShowColors(false); setShowGallery(true)}}>
          Gallery
        </StyledButton> }
        { setSelectedColor && <StyledButton color="info" onClick={() => {setShowGallery(false); setShowColors(true)}}>
          Colors
        </StyledButton> }
      </ButtonGroup> }
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
      ) : showColors ? (
        <ColorGrid  
          colorOptions={colorOptions}           
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
      />
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