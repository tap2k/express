import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import useGeolocation from "react-hook-geolocation";
import uploadContent from "../hooks/uploadcontent";
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

async function myUploadContent(file, lat, long, channelID, router) {
  const formData = new FormData();
  formData.append('mediafile', file);
  await uploadContent({ myFormData: formData, lat, long, channelID });
  const query = router?.asPath?.slice(router?.pathname?.length);
  router.push("/" + query);
}

export default function Uploader({ channelID, useLocation, ...props }) {
  const router = useRouter();
  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  let lat = null;
  let long = null;

  if (useLocation) {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
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
        <StyledButton color="secondary" onClick={clearFile} disabled={!file}>
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
      }}>
        {file ? (
          <>
            {file.type.startsWith('image/') && <img src={preview} alt={file.name} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />}
            {file.type.startsWith('video/') && <video src={preview} controls style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />}
            {file.type.startsWith('audio/') && <audio src={preview} controls style={{width: '100%'}} />}
          </>
        ) : (
          <div style={{color: '#999', fontSize: '1.2em'}}>No file selected</div>
        )}
      </div>

      <div style={{marginBottom: '20px'}}>
        {file && (
          <>
            <strong>File:</strong> {file.name}<br />
            <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
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

      <StyledButton
        color="success"
        onClick={() => myUploadContent(file, lat, long, channelID, router)}
        disabled={!file}
      >
        Submit
      </StyledButton>
    </RecorderWrapper>
  );
}
