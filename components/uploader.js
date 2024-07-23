import React, { useRef, useState, useEffect } from "react";
import { Input } from "reactstrap";
import { useRouter } from "next/router";
import useGeolocation from "react-hook-geolocation";
import useFileUpload from 'react-use-file-upload';
import uploadContent from "../hooks/uploadcontent";
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

export default function Uploader({ channelID, useLocation, ...props }) {
  const router = useRouter();
  const fileInputRef = useRef();
  const [preview, setPreview] = useState(null);
  const descriptionRef = useRef();

  const {
    files,
    fileNames,
    fileTypes,
    totalSize,
    totalSizeInBytes,
    handleDragDropEvent,
    clearAllFiles,
    createFormData,
    setFiles,
    removeFile,
  } = useFileUpload();

  let lat = null;
  let long = null;

  if (useLocation) {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  const uploadFiles = async (e) => {
    e.preventDefault();
    if (!fileNames.length)
      return;
    await uploadContent({myFormData: createFormData(), channelID, lat, long, description: descriptionRef.current.value, published: true, setProgress: setProgress}); 
    clearAllFiles();
    const query = router?.asPath?.slice(router?.pathname?.length);
    router.push("/" + query);
  }

  useEffect(() => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setPreview(null);
    }
  }, [files]);

  const handleFileChange = (e) => {
    setFiles(e, 'w');
  };

  const clearFile = () => {
    clearAllFiles();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <RecorderWrapper {...props}>
      <ButtonGroup>
        <StyledButton color="primary" onClick={() => fileInputRef.current.click()}>
          Select File
        </StyledButton>
        <StyledButton color="secondary" onClick={clearFile} disabled={!files.length}>
          Clear File
        </StyledButton>
      </ButtonGroup>

      <div
        style={{
          width: '100%',
          height: '200px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
        onDragEnter={handleDragDropEvent}
        onDragOver={handleDragDropEvent}
        onDrop={(e) => {
          handleDragDropEvent(e);
          setFiles(e, 'w');
        }}
      >
        {files.length > 0 ? (
          <>
            {files[0].type.startsWith('image/') && <img src={preview} alt={files[0].name} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />}
            {files[0].type.startsWith('video/') && <video src={preview} controls style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />}
            {files[0].type.startsWith('audio/') && <audio src={preview} controls style={{width: '100%'}} />}
            <button
              onClick={() => clearAllFiles()}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderRadius: '50%',
                width: '25px',
                height: '25px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </>
        ) : (
            <div style={{ textAlign: 'center' }}>
              <StyledButton
                color="secondary"
                onClick={() => fileInputRef.current.click()}
              >
                Add File
              </StyledButton>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept="image/*,audio/*,video/*"
        onChange={handleFileChange}
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

      <StyledButton
        color="success"
        onClick={uploadFiles}
        disabled={!files.length}
        block
      >
        Submit
      </StyledButton>
    </RecorderWrapper>
  );
}