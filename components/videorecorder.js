/* components/videorecorder.js */

import { useEffect, useState, useRef } from "react";
import { Input } from "reactstrap";
import { useRouter } from "next/router";
import { useReactMediaRecorder } from "react-media-recorder";
import useGeolocation from "react-hook-geolocation";
import getBlobDuration from 'get-blob-duration';
import ysFixWebmDuration from 'fix-webm-duration';
import uploadContent from "../hooks/uploadcontent";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

async function uploadRecording(blob, lat, long, description, channelID, status, router) 
{
  if (status != "stopped" || !blob)
    return;

  getBlobDuration(blob).then(function(duration) {
    ysFixWebmDuration(blob, duration, async (fixedBlob) => {
      const formData = require('form-data');
      const myFormData = new formData();
      myFormData.append('mediafile', fixedBlob, "video.webm");
      await uploadContent({myFormData, lat, long, description, published: true, channelID});
      const query = router?.asPath?.slice(router?.pathname?.length);
      router.push("/" + query);
    });
  });
}

function Output({ src, stream, status, ...props }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 16, height: 9 });

  useEffect(() => {
    if (videoRef.current) {
      if (stream && status !== "stopped") {
        videoRef.current.srcObject = stream;
        // Get video tracks
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          // Get the settings of the video track
          const { width, height } = videoTrack.getSettings();
          if (width && height) {
            setDimensions({ width, height });
          }
        }
      } else {
        videoRef.current.srcObject = null;
        videoRef.current.src = src;
      }
    }
  }, [stream, src, status]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const height = (width * dimensions.height) / dimensions.width;
        containerRef.current.style.height = `${height}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions]);

  if (!stream && !src) return null;

  const controls = src && status === "stopped";

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        marginBottom: '20px',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
    >
      <video 
        ref={videoRef} 
        controls={controls} 
        autoPlay 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        {...props} 
      />
    </div>
  );
}

export default function VideoRecorder({ channelID, useLocation, ...props }) {
  const router = useRouter();
  const [blob, setBlob] = useState();
  const [recordingTime, setRecordingTime] = useState(0);
  const descriptionRef = useRef();

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
    blobPropertyBag: { type: "video/mp4" },
    onStop: (blobUrl, blob) => setBlob(blob),
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <RecorderWrapper {...props}>
      <ButtonGroup>
        <StyledButton 
          color="primary" 
          onClick={() => status === "paused" ? resumeRecording() : startRecording()}
          disabled={status === "recording"}
        >
          {status === "recording" ? "Recording..." : recordingTime ? "Resume" : "Start"}
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

      <Output src={mediaBlobUrl} stream={previewStream} status={status} />
      
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
        size="lg" 
        block 
        onClick={(e) => {
          e.preventDefault();
          const description = descriptionRef.current.value;
          uploadRecording(blob, lat, long, description, channelID, status, router);
        }}
        disabled={status !== "stopped" || !blob}
      >
        {status === "recording" || status === "paused"
          ? `Recording (${formatTime(recordingTime)})`
          : "Submit"}
      </StyledButton>
    </RecorderWrapper>
  );
}