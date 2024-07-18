import { useEffect, useState, useRef } from "react";
import { Button, Alert, Input } from "reactstrap";
import { useRouter } from "next/router";
import { useReactMediaRecorder } from "react-media-recorder";
import useGeolocation from "react-hook-geolocation";
import uploadContent from "../hooks/uploadcontent";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

async function uploadRecording(blob, lat, long, description, channelID, status, router) 
{
  if (status != "stopped" || !blob)
    return;
  const formData = require('form-data');
  const myFormData = new formData();
  myFormData.append('mediafile', blob, "audio.ogg");
  await uploadContent({myFormData, lat, long, description, published: true, channelID});
  const query = router?.asPath?.slice(router?.pathname?.length);
  router.push("/" + query);
}

function Status({ status, ...props }) {
  const [counter, setCounter] = useState(0.0);

  useEffect(() => {
    let interval;
    if (status === "recording") {
      interval = setInterval(() => setCounter(prev => prev + 0.1), 100);
    } else if (status === "stopped") {
      setCounter(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <Alert color="primary" {...props}>
      <h2>{status} : {counter.toFixed(1)}s</h2>
    </Alert>
  );
}

function Output({ src, ...props }) {
  if (!src) return null;
  
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  return (
    <audio 
      src={src}
      controls 
      {...props}
      style={{ width: '100%', marginBottom: '20px' }}
    >
      {isSafari && <source src={src} type="audio/aac" />}
      Your browser does not support the audio element.
    </audio>
  );
}

export default function Recorder({ channelID, useLocation, ...props }) {
  const router = useRouter();
  const [blob, setBlob] = useState();
  const descriptionRef = useRef();

  let lat = null;
  let long = null;

  if (useLocation)
  {
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
    onStop: (blobUrl, blob) => {setBlob(blob)}
  });

  useEffect(() => {
    if (error) setErrorText(error);
  }, [error]);

  return (
    <RecorderWrapper {...props}>
      <ButtonGroup>
        <StyledButton color="primary" size="lg" onClick={(e) => {e.preventDefault(); if (status === "paused") resumeRecording(); else startRecording();}}>
          {status === "recording" ? "Resume" : "Start"}
        </StyledButton>
        <StyledButton color="warning" size="lg" onClick={pauseRecording} disabled={status !== "recording"}>
          Pause
        </StyledButton>
        <StyledButton color="danger" size="lg" onClick={stopRecording} disabled={status === "stopped"}>
          Stop
        </StyledButton>
      </ButtonGroup>
      
      <div style={{
        width: '100%',
        height: '60px',
        backgroundColor: '#e9ecef',
        borderRadius: '30px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{
          width: status === "recording" ? '100%' : '0',
          height: '100%',
          backgroundColor: '#007bff',
          transition: 'width 30.0s ease-in-out'
        }} />
      </div>
      
      <Status status={status} style={{marginBottom: 20}} />
      <Output src={mediaBlobUrl} />

      <Input
        type="text"
        innerRef={descriptionRef}
        placeholder="Enter text"
        style={{
          width: '100%',
          marginBottom: '10px'
        }}
      />
      
      <Button 
        color="success" 
        size="lg" 
        block 
        onClick={(e) => {
          e.preventDefault();
          const description = descriptionRef.current.value;
          uploadRecording(blob, lat, long, description, channelID, status, router);
        }}
        disabled={status !== "stopped" || !blob}
      >
        Submit
      </Button>
    </RecorderWrapper>
  );
}