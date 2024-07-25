import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from "react";
import { Input, Button } from "reactstrap";
import { useReactMediaRecorder } from "react-media-recorder";
import useGeolocation from "react-hook-geolocation";
import useFileUpload from 'react-use-file-upload';
import uploadSubmission from "../hooks/uploadsubmission";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

async function uploadRecording(myFormData, lat, long, description, channelID, status, router) 
{
  if (status !== "stopped" || !myFormData.has('mediafile'))
    return;

  try {
    await uploadSubmission({myFormData, lat, long, description, published: true, channelID, router});
  } catch (error) {
    console.error('Error uploading content:', error);
    setErrorText('Failed to upload content. Please try again.');
  }
}

function Output({ src }) {  
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  return (
    <audio 
      src={src}
      controls 
      style={{ width: '100%', marginBottom: '20px' }}
    >
      {isSafari && <source src={src} type="audio/aac" />}
      Your browser does not support the audio element.
    </audio>
  );
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function Recorder({ channelID, useLocation }) {
  const router = useRouter();
  const [blob, setBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const descriptionRef = useRef();
  const fileInputRef = useRef();
  
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

  const {
    status,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    askPermissionOnMount: true,
    blobPropertyBag: { type: "audio/mp3" },
    onStop: (blobUrl, blob) => setBlob(blob)
  });

  useEffect(() => {
    if (error) setErrorText(error);
  }, [error]);

  useEffect(() => {
    let interval;
    if (status === "recording") {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else if (status === "stopped") {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleRecordingAction = () => {
    if (status === "recording") {
      pauseRecording();
    } else if (status === "paused") {
      resumeRecording();
    } else {
      startRecording();
    }
  };

  const handleFileChange = (e) => {
    setFiles(e, 'w');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blob)
      return;

    const description = descriptionRef.current.value;
    
    //const formData = createFormData();
    const formData = new FormData();
    formData.append('mediafile', blob, 'audio.mp3');
    
    if (files.length > 0) 
      formData.append('thumbnail', files[0], files[0].name);
    
    await uploadRecording(formData, lat, long, description, channelID, status, router);
  };

  return (
    <RecorderWrapper>
      <ButtonGroup>
        <StyledButton 
          color="primary" 
          onClick={handleRecordingAction}
        >
          {status === "recording" ? "Pause" : status === "paused" ? "Resume" : "Start"}
        </StyledButton>
        <StyledButton 
          color="secondary" 
          onClick={stopRecording}
          disabled={status != "recording"}
        >
          Stop
        </StyledButton>
      </ButtonGroup>

      <div style={{
        width: '100%',
        height: '30px',
        backgroundColor: '#e9ecef',
        borderRadius: '30px',
        overflow: 'hidden',
        marginBottom: '20px',
        position: 'relative'
      }}>
        <div style={{
          width: `${(recordingTime / 60) * 100}%`,
          height: '100%',
          backgroundColor: '#007bff',
          transition: 'width 1s linear'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: recordingTime > 150 ? 'white' : 'black',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          <span style={{ marginRight: '10px' }}>{formatTime(recordingTime)}</span>
        </div>
      </div>

      <Output src={mediaBlobUrl} />
      
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
            <img
              src={URL.createObjectURL(files[0])}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <StyledButton
              color="secondary"
              onClick={() => fileInputRef.current.click()}
            >
              Add Image
            </StyledButton>
          </div>
        )}
      </div>

      <Input
        type="text"
        innerRef={descriptionRef}
        placeholder="Enter text"
        style={{ width: '100%', marginBottom: '10px' }}
      />
      
      <Button 
        color="success" 
        size="lg" 
        block 
        onClick={handleSubmit}
        disabled={status !== "stopped" || !blob}
        style={{ minWidth: '200px' }}
      >
        {status === "recording" ? `Recording (${formatTime(recordingTime)})` : "Submit"}
      </Button>
    </RecorderWrapper>
  );
}