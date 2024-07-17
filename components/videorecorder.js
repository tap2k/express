/* components/videorecorder.js */

import { useEffect, useState, useRef } from "react";
import { Alert } from "reactstrap";
import { useRouter } from "next/router";
import { useReactMediaRecorder } from "react-media-recorder";
import useGeolocation from "react-hook-geolocation";
import getBlobDuration from 'get-blob-duration';
import ysFixWebmDuration from 'fix-webm-duration';
import uploadContent from "../hooks/uploadcontent";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

async function uploadRecording(blob, lat, long, channelID, status, router) 
{
  if (status != "stopped" || !blob)
    return;

  getBlobDuration(blob).then(function(duration) {
    ysFixWebmDuration(blob, duration, async (fixedBlob) => {
      const formData = require('form-data');
      const myFormData = new formData();
      myFormData.append('mediafile', fixedBlob, "video.webm");
      await uploadContent({myFormData: myFormData, lat: lat, long: long, channelID: channelID});
      const query = router?.asPath?.slice(router?.pathname?.length);
      router.push("/" + query);
    });
  });
}

function Status({ status, ...props }) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let interval;
    if (status === "recording") {
      interval = setInterval(() => setCounter(prev => prev + 1), 1000);
    } else if (status === "stopped") {
      setCounter(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <Alert 
      color="primary" 
      style={{ marginBottom: '20px' }}
      {...props}
    >
      <h2>{status.charAt(0).toUpperCase() + status.slice(1)} : {counter}s</h2>
    </Alert>
  );
}

function Output({ src, stream, status, ...props }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (stream && status !== "stopped") {
        videoRef.current.srcObject = stream;
      } else {
        videoRef.current.srcObject = null;
        videoRef.current.src = src;
      }
    }
  }, [stream, src, status]);

  if (!stream && !src) return null;

  const controls = src && status === "stopped";

  return (
    <div style={{
      width: '100%',
      marginBottom: '20px',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <video 
        ref={videoRef} 
        controls={controls} 
        autoPlay 
        style={{
          width: '100%',
          height: 'auto'
        }}
        {...props} 
      />
    </div>
  );
}

export default function VideoRecorder({ channelID, useLocation, ...props }) {
  const router = useRouter();
  const [blob, setBlob] = useState();

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
    previewStream
  } = useReactMediaRecorder({
    video: true,
    askPermissionOnMount: true,
    blobPropertyBag: { type: "video/webm" },
    onStop: (blobUrl, blob) => setBlob(blob),
  });

  useEffect(() => {
    if (error) setErrorText(error);
  }, [error]);

  return (
    <RecorderWrapper {...props}>
      <ButtonGroup>
        <StyledButton 
          color="primary" 
          onClick={() => status === "paused" ? resumeRecording() : startRecording()}
          disabled={status === "recording"}
        >
          {status === "recording" ? "Recording..." : "Start"}
        </StyledButton>
        <StyledButton 
          color="warning" 
          onClick={pauseRecording}
          disabled={status !== "recording"}
        >
          Pause
        </StyledButton>
        <StyledButton 
          color="danger" 
          onClick={stopRecording}
          disabled={status === "stopped"}
        >
          Stop
        </StyledButton>
      </ButtonGroup>

      <Status status={status} />

      <Output src={mediaBlobUrl} stream={previewStream} status={status} />

      <StyledButton 
        color="success" 
        size="lg" 
        block 
        onClick={() => uploadRecording(blob, lat, long, channelID, status, router)}
        disabled={status !== "stopped" || !blob}
      >
        Submit
      </StyledButton>
    </RecorderWrapper>
  );
}