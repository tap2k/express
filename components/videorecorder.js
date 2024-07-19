import React, { useEffect, useState, useRef } from "react";
import { Input } from "reactstrap";
import { useRouter } from "next/router";
import RecordRTC from 'recordrtc';
import useGeolocation from "react-hook-geolocation";
import uploadContent from "../hooks/uploadcontent";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

function Output({ src, stream, status, videoRef }) {
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream || null;
      videoRef.current.src = src || '';
    }
  }, [stream, src, status]);

  if (!stream && !src) return null;

  return (
    <div style={{ width: '100%', marginBottom: '10px' }}>
      <video 
        ref={videoRef} 
        controls={status === "stopped"}
        autoPlay
        playsInline
        muted={status !== "stopped"}
        style={{ width: '100%', borderRadius: '10px' }}
      />
    </div>
  );
}

export default function VideoRecorder({ channelID, useLocation }) {
  const router = useRouter();
  const [blob, setBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const descriptionRef = useRef();
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);

  const geolocation = useGeolocation();
  const lat = useLocation ? geolocation.latitude : null;
  const long = useLocation ? geolocation.longitude : null;

  useEffect(() => {
    startPreview();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (status === "recording") {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else if (status === "stopped") {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error starting preview:', error);
      setErrorText(error.message);
    }
  };

  const startRecording = () => {
    if (streamRef.current) {
      recorderRef.current = new RecordRTC(streamRef.current, { type: 'video' });
      recorderRef.current.startRecording();
      setStatus('recording');
    } else {
      setErrorText('No camera stream available. Please allow camera access and try again.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        setBlob(blob);
        setMediaBlobUrl(URL.createObjectURL(blob));
        setStatus('stopped');
      });
    }
  };

  const uploadRecording = async () => {
    if (status === "stopped" && blob) {
      const formData = new FormData();
      formData.append('mediafile', blob, "video.webm");
      const description = descriptionRef.current.value;
      await uploadContent({formData, lat, long, description, published: true, channelID});
      router.push(router.asPath);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <RecorderWrapper>
      <ButtonGroup>
        <StyledButton 
          color="primary" 
          onClick={startRecording}
          disabled={status === "recording"}
        >
          {status === "recording" ? "Recording..." : "Start"}
        </StyledButton>
        <StyledButton 
          color="danger" 
          onClick={stopRecording}
          disabled={status !== "recording"}
        >
          Stop
        </StyledButton>
      </ButtonGroup>

      <Output src={mediaBlobUrl} stream={streamRef.current} status={status} videoRef={videoRef} />
      
      <Input
        type="text"
        innerRef={descriptionRef}
        placeholder="Enter description"
        style={{ width: '100%', marginBottom: '10px' }}
      />
      
      <StyledButton 
        color="success" 
        size="lg" 
        block 
        onClick={uploadRecording}
        disabled={status !== "stopped" || !blob}
      >
        {status === "recording" ? `Recording (${formatTime(recordingTime)})` : "Submit"}
      </StyledButton>
    </RecorderWrapper>
  );
}
