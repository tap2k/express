import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from "react";
import { Input, Button, Progress } from "reactstrap";
import useGeolocation from "react-hook-geolocation";
import useFileUpload from 'react-use-file-upload';
import uploadSubmission from "../hooks/uploadsubmission";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

export default function Uploader({ channelID, useLocation, ...props }) {
  const router = useRouter();
  const fileInputRef = useRef();
  const [previews, setPreviews] = useState([]);
  const [progress, setProgress] = useState(0);

  const descriptionRef = useRef();
  const extUrlRef = useRef();

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
    try {
      await uploadSubmission({myFormData: createFormData(), channelID, lat, long, description: descriptionRef.current.value, ext_url: extUrlRef.current.value, published: true, setProgress, router}); 
      clearAllFiles();
      setPreviews([]);
      descriptionRef.current.value = "";
      extUrlRef.current.value = "";
    }
    catch (error) {
      console.error('Error uploading content:', error);
      setErrorText('Failed to upload content. Please try again.');
    }
  }

  useEffect(() => {
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({ file, preview: reader.result });
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [files]);

  const handleFileChange = (e) => {
    setFiles(e, 'a');
  };

  const removePreview = (index) => {
    removeFile(index);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearFile = () => {
    clearAllFiles();
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <RecorderWrapper {...props}>
      <ButtonGroup>
        <StyledButton color="primary" onClick={() => fileInputRef.current.click()}>
          Select Files
        </StyledButton>
        <StyledButton color="secondary" onClick={clearFile} disabled={!files.length}>
          Clear Files
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
          //marginBottom: 20,
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
      {previews.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          {previews.map((preview, index) => (
            <div key={index} style={{ position: 'relative', width: '150px', height: '150px' }}>
              {preview.file.type.startsWith('image/') && <img src={preview.preview} alt={preview.file.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
              {preview.file.type.startsWith('video/') && <video src={preview.preview} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
              {preview.file.type.startsWith('audio/') && <audio src={preview.preview} controls style={{width: '100%'}} />}
              <button
                onClick={() => removePreview(index)}
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
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <StyledButton
            color="secondary"
            onClick={() => fileInputRef.current.click()}
          >
            Add Files
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
        multiple
      />
      <Progress value={progress} style={{marginBottom: 20}}  />
      <Input
        type="text"
        innerRef={descriptionRef}
        placeholder="Enter text"
        style={{
          width: '100%',
          marginBottom: '10px'
        }}
      />

      <Input
        type="text"
        innerRef={extUrlRef}
        placeholder="Enter URL"
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <Button
        color="success"
        onClick={uploadFiles}
        //disabled={!files.length}
        block
      >
        Submit
      </Button>
    </RecorderWrapper>
  );
}