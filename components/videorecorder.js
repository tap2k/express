import { useEffect, useState, useRef, useCallback } from "react";
import { Input } from "reactstrap";
import { useRouter } from "next/router";
import RecordRTC from 'recordrtc';
import useGeolocation from "react-hook-geolocation";
import { MdFlipCameraIos } from 'react-icons/md';
import uploadContent from "../hooks/uploadcontent";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

async function uploadRecording(blob, lat, long, description, channelID, status, router) 
{
  if (status != "stopped" || !blob)
    return;
  const formData = require('form-data');
  const myFormData = new formData();
  //myFormData.append('mediafile', blob, "video.webm");
  myFormData.append('mediafile', blob, "video.mp4");
  await uploadContent({myFormData, lat, long, description, published: true, channelID});
  const query = router?.asPath?.slice(router?.pathname?.length);
  router.push("/" + query);
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
  const [aspectRatio, setAspectRatio] = useState(16.0 / 9.0);
  const [facingMode, setFacingMode] = useState('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  let lat = null;
  let long = null;

  if (useLocation) {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  const checkForMultipleCameras = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    setHasMultipleCameras(videoDevices.length > 1);
  }, []);

  const startStream = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
            video: {
              facingMode: facingMode,
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 },
              aspectRatio: { ideal: 16/9 },
              frameRate: 30,
              resizeMode: 'crop-and-scale'
            },
          },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current.play();
            setAspectRatio(videoRef.current.videoWidth / videoRef.current.videoHeight);
          } catch (playError) {
            console.error('Error playing video:', playError);
            setErrorText('Failed to start video preview. Please try again.');
          }
        };
      }
      return stream;
    } catch (error) {
      console.error('Error starting stream:', error);
      setErrorText('Failed to access camera. Please try again.');
      throw error;
    }
  }, [facingMode]);

  const startRecording = async () => {
    try {
      let stream = streamRef?.current;
      if (!stream)
        stream = await startStream();
      else
        videoRef.current.srcObject = stream;
      recorderRef.current = new RecordRTC(stream, {
        type: 'video',
        //mimeType: 'video/webm;codecs=vp9,opus',
        mimeType: 'video/mp4',
        frameInterval: 1,
        recorderType: RecordRTC.MediaStreamRecorder
      });
      recorderRef.current.startRecording();
      setRecordingTime(0);
      setStatus('recording');
    } catch (error) {
      console.error('Error starting recording:', error);
      setErrorText('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const recordedBlob = recorderRef.current.getBlob();
        setBlob(recordedBlob);
        setStatus('stopped');
        
        if (videoRef.current) {
          const url = URL.createObjectURL(recordedBlob);
          videoRef.current.src = url;
          videoRef.current.srcObject = null;
          videoRef.current.muted = false;
          videoRef.current.play().catch(error => console.error('Error playing recorded video:', error));
        }
      });
    }
  }

  const flipCamera = useCallback(() => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  }, []);

  useEffect(() => {
    checkForMultipleCameras();
    startStream();
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

  return (
    <RecorderWrapper>
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        paddingTop: `${(1 / aspectRatio) * 100}%`,
        marginBottom: '10px'
      }}>
      <video 
        ref={videoRef} 
        autoPlay
        playsInline
        muted={status != "stopped"}
        controls={status === "stopped"}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '10px',
          objectFit: 'cover',
          pointerEvents: status === 'recording' ? 'none' : 'auto',
          // mirror preview for front camera
          transform: facingMode === 'user' && status !== 'stopped' ? 'scaleX(-1)' : 'none'
        }}
      />
        <div 
          onClick={status === 'recording' ? stopRecording : startRecording}
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgb(255, 0, 0)', 
            border: '15px solid rgba(215, 215, 215)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        >
          {status === 'recording' && (
            <div style={{
              width: '30px',
              height: '30px',
              backgroundColor: 'rgb(0, 0, 0)',
              flexShrink: 0
            }} />
          )}
        </div>
        {status === 'recording' && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: '#ffffff',
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            {formatTime(recordingTime)}
          </div>
        )}
        {hasMultipleCameras && (
          <button 
            onClick={flipCamera}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1,
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <MdFlipCameraIos size={24} />
          </button>
        )}
      </div>
      
      <Input
        type="text"
        innerRef={descriptionRef}
        placeholder="Enter text"
        style={{ width: '100%', marginBottom: '10px' }}
      />
      
      <ButtonGroup>
        <StyledButton 
          color="secondary" 
          size="lg" 
          onClick={startRecording} 
          disabled={status !== "stopped"}
        >
          Retake
        </StyledButton>
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
      </ButtonGroup>
    </RecorderWrapper>
  );
}
