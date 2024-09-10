import { useState, useEffect } from "react";
import { ButtonGroup, StyledButton } from './recorderstyles';
import { imageOptions, audioOptions, colorOptions } from './fileoptions';
import AudioGrid from './audiogrid';
import ColorGrid from './colorgrid';
import ImageGrid from './imagegrid';
import UploadWidget from "./uploadwidget";
import DalleWidget from "./dallewidget";

export default function MediaPicker({ mediaUrl, progress, uploadedFiles, setUploadedFiles, selectedColor, setSelectedColor, selectedMedia, setSelectedMedia, deleteMedia, setDeleteMedia, generating, setGenerating, setProgress, accept, multiple, gallery, dalle, ...props }) {
  const [showGallery, setShowGallery] = useState(true);
  const [showColors, setShowColors] = useState(false);
  const [showDalle, setShowDalle] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  
  useEffect(() => {
    if (!multiple && setUploadedFiles)
      setUploadedFiles([]);
  }, [selectedMedia]);

  useEffect(() => {
    if (!multiple && uploadedFiles?.length && setSelectedMedia)
      setSelectedMedia(null);
  }, [uploadedFiles]);

  useEffect(() => {
    if (setSelectedMedia)
      setSelectedMedia(null);
    if (setUploadedFiles)
      setUploadedFiles([]);
    if (setDeleteMedia)
      setDeleteMedia(true);
  }, [selectedColor]);

  return (
    <div {...props}>
      <ButtonGroup>
        {gallery && (
          <StyledButton color="info" onClick={() => {setShowColors(false); setShowGallery(true); setShowDalle(false); setShowUpload(false)}}>
            Gallery
          </StyledButton>
        )}
        {dalle && process.env.NEXT_PUBLIC_AI_ENABLED === "true" && (
          <StyledButton color="info" onClick={() => {setShowColors(false); setShowGallery(false); setShowDalle(true); setShowUpload(false)}}>
            AI Image
          </StyledButton>
        )}
        {setSelectedColor && (
          <StyledButton color="info" onClick={() => {setShowGallery(false); setShowColors(true); setShowDalle(false);  setShowUpload(false)}}>
            Colors
          </StyledButton>
        )}
        {setUploadedFiles && <StyledButton color="primary" onClick={() => {setShowColors(false); setShowGallery(false); setShowDalle(false); setShowUpload(true)}}>
          Upload
        </StyledButton>}
      </ButtonGroup>
      {showGallery ? (
        gallery === "image" ? (
          <ImageGrid 
            imageOptions={imageOptions}
            selectedImage={selectedMedia}
            setSelectedImage={setSelectedMedia}
          />
        ) : gallery === "audio" ? (
          <AudioGrid
            audioOptions={audioOptions}           
            selectedAudio={selectedMedia}
            setSelectedAudio={setSelectedMedia}
          />
        ) : null
      ) : showDalle ? (
        <DalleWidget
          selectedImage={selectedMedia}
          setSelectedImage={setSelectedMedia}
          generating={generating}
          setGenerating={setGenerating}
          setProgress={setProgress}
        />
      ) : showColors ? (
        <ColorGrid  
          colorOptions={colorOptions}           
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      ) : showUpload && (
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
      )}
    </div>
  );
}