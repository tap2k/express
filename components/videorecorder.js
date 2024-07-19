import { useEffect, useState, useRef, useCallback } from "react";
import { Input } from "reactstrap";
import { useRouter } from "next/router";
import RecordRTC from 'recordrtc';
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
  myFormData.append('mediafile', blob, "video.webm");
  await uploadContent({myFormData, lat, long, description, published: true, channelID});
  const query = router?.asPath?.slice(router?.pathname?.length);
  router.push("/" + query);
}

function Output({ videoRef }) {
  return (
    <div style={{ width: '100%', marginBottom: '20px' }}>
      <video 
        ref={videoRef} 
        autoPlay
        playsInline
        muted
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

  let lat = null;
  let long = null;

  if (useLocation) {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  const startPreview = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for the video to be loaded before playing
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current.play();
          } catch (playError) {
            console.error('Error playing video:', playError);
            setErrorText('Failed to start video preview. Please try again.');
          }
        };
      }
    } catch (error) {
      console.error('Error starting preview:', error);
      setErrorText(error.message);
    }
  }, []);

  useEffect(() => {
    startPreview();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [startPreview]);

  useEffect(() => {
    let interval;
    if (status === "recording") {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else if (status === "stopped") {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const startRecording = () => {
    if (streamRef.current) {
      recorderRef.current = new RecordRTC(streamRef.current, {
        type: 'video',
        mimeType: 'video/webm;codecs=vp9,opus',
        frameInterval: 1,
        recorderType: RecordRTC.MediaStreamRecorder
      });
      recorderRef.current.startRecording();
      setStatus('recording');
    } else {
      setErrorText('No camera stream available. Please allow camera access and try again.');
    }
  }

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const recordedBlob = recorderRef.current.getBlob();
        setBlob(recordedBlob);
        setStatus('stopped');
        
        // Add a small delay before updating the video source
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = URL.createObjectURL(recordedBlob);
            videoRef.current.muted = false;
          }
        }, 100);
      });
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

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

      <Output videoRef={videoRef} />
      
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
        onClick={(e) => {
          e.preventDefault();
          const description = descriptionRef.current.value;
          uploadRecording(blob, lat, long, description, channelID, status, router);
        }}
        disabled={status !== "stopped" || !blob}
      >
        {status === "recording" ? `Recording (${formatTime(recordingTime)})` : "Submit"}
      </StyledButton>
    </RecorderWrapper>
  );
}
