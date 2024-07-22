import React, { useRef, useState, useEffect } from "react";
import { Input } from "reactstrap";
import { useRouter } from "next/router";
import useGeolocation from "react-hook-geolocation";
import useFileUpload from 'react-use-file-upload';
import uploadContent from "../hooks/uploadcontent";
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

export default function Uploader({ channelID, useLocation, ...props }) {
  const router = useRouter();
  const inputRef = useRef();
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
    setFiles(e, 'a');
  };

  const clearFile = () => {
    clearAllFiles();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <RecorderWrapper {...props}>
      <ButtonGroup>
        <StyledButton color="primary" onClick={() => inputRef.current.click()}>
          Select File
        </StyledButton>
        <StyledButton color="secondary" onClick={clearFile} disabled={!files.length}>
          Clear File
        </StyledButton>
      </ButtonGroup>

      <div style={{
        width: '100%',
        height: '300px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px',
      }}
      onDragEnter={handleDragDropEvent}
      onDragOver={handleDragDropEvent}
      onDrop={(e) => {
        handleDragDropEvent(e);
        setFiles(e, 'a');
      }}>
        {files.length > 0 ? (
          <>
            {files[0].type.startsWith('image/') && <img src={preview} alt={files[0].name} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />}
            {files[0].type.startsWith('video/') && <video src={preview} controls style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />}
            {files[0].type.startsWith('audio/') && <audio src={preview} controls style={{width: '100%'}} />}
          </>
        ) : (
          <div style={{color: '#999', fontSize: '1.2em'}}>No file selected</div>
        )}
      </div>

      <div style={{marginBottom: '20px'}}>
        {files.length > 0 && (
          <>
            <strong>File:</strong> {files[0].name}<br />
            <strong>Size:</strong> {(files[0].size / 1024 / 1024).toFixed(2)} MB
          </>
        )}
      </div>

      <input
        ref={inputRef}
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
      >
        Submit
      </StyledButton>
    </RecorderWrapper>
  );
}