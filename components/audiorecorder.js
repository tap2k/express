import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from "react";
import { Progress } from "reactstrap";
import { useReactMediaRecorder } from "react-media-recorder";
import uploadSubmission from "../hooks/uploadsubmission";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from './recorderstyles';
import UploadWidget from './uploadwidget';
import ContentInputs from "./contentinputs";

//const fileExt = "webm";
const fileExt = "mp3";

function Output({ src }) {  
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  return (
    <audio 
      src={src}
      controls 
      style={{ width: '100%', marginBottom: '10px' }}
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

export default function AudioRecorder({ channelID, privateID, uploading, setUploading, lat, long, ...props }) {
  const router = useRouter();
  const [blob, setBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const titleRef = useRef();
  const nameRef = useRef();
  const locationRef = useRef();
  const emailRef = useRef();
  const extUrlRef = useRef();

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
    blobPropertyBag: { type: "audio/" + fileExt },
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (status !== "stopped" || !blob)
      return;

    if (setUploading)
      setUploading(true);

    try {
      const myFormData = new FormData();

      if (uploadedFiles.length) 
      {
        myFormData.append('mediafile', uploadedFiles[0], uploadedFiles[0].name);
        myFormData.append('audiofile', blob, 'audio.' + fileExt);
      }
      else
        myFormData.append('mediafile', blob, 'audio.' + fileExt);

      await uploadSubmission({myFormData, lat, long, title: titleRef.current?.value, name: nameRef.current?.value, email: emailRef.current?.value, location: locationRef.current?.value, ext_url: extUrlRef.current?.value, channelID, setProgress, router});

      if (titleRef.current)
        titleRef.current.value = "";
      if (nameRef.current)
        nameRef.current.value = "";
      if (emailRef.current)
        emailRef.current.value = "";
      if (locationRef.current)
        locationRef.current.value = "";
      if (extUrlRef.current)
        extUrlRef.current.value = "";
      setProgress(0);

      } catch (error) {
        console.error('Error uploading content:', error);
        setErrorText('Failed to upload content. Please try again.');
      }
      
    if (setUploading)
      setUploading(false); 
    setUploadedFiles([]); 
  };

  const handleRecordingAction = () => {
    if (status === "recording") {
      pauseRecording();
    } else if (status === "paused") {
      resumeRecording();
    } else {
      startRecording();
    }
  };

  return (
    <RecorderWrapper {...props}>
      <ButtonGroup style={{marginBottom: '10px'}}>
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
        marginBottom: '10px',
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
      
      <UploadWidget progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} accept="image/*" style={{minHeight: '200px'}} />
      <Progress value={progress} style={{marginBottom: '20px'}} />

      <ContentInputs style={{marginBottom: '20px'}} titleRef={titleRef} nameRef={nameRef} emailRef={emailRef} locationRef={locationRef} extUrlRef={extUrlRef}  />
      
      <StyledButton 
        color="success" 
        size="lg" 
        block 
        onClick={handleUpload}
        disabled={status !== "stopped" || !blob || uploading}
      >
        {status === "recording" ? `Recording (${formatTime(recordingTime)})` : "Submit"}
      </StyledButton>
    </RecorderWrapper>
  );
}
