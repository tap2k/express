import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from "react";
import { Progress } from "reactstrap";
import RecordRTC from 'recordrtc';
import { MdFlipCameraIos } from 'react-icons/md';
import uploadSubmission from "../hooks/uploadsubmission";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from './recorderstyles';
import ContentInputs from "./contentinputs";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function isMobileSafari() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) && !window.MSStream && /Safari/.test(ua) && !/Chrome/.test(ua);
}

export default function VideoRecorder({ channelID, privateID, jwt, uploading, setUploading, lat, long, ...props }) {
  const router = useRouter();
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [blob, setBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(16.0 / 9.0);
  const [facingMode, setFacingMode] = useState('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const titleRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const locationRef = useRef();
  const extUrlRef = useRef();
  const fileExt = "mp4";

  useEffect(() => {
    checkForMultipleCameras();
  }, []);

  useEffect(() => {
    startStream();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  useEffect(() => {
    let interval;
    if (status === "recording") {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else if (status === "stopped") {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleUpload = async (e) => 
  {
    e.preventDefault();
    if (status != "stopped" || !blob)
      return;

    if (setUploading)
      setUploading(true);

    try {
      const formData = require('form-data');
      const myFormData = new formData();
      myFormData.append('mediafile', blob, "video."+fileExt);
      
      await uploadSubmission({myFormData, channelID, lat, long, title: titleRef.current?.value, name: nameRef.current?.value, email: emailRef.current?.value, location: locationRef.current?.value, ext_url: extUrlRef.current?.value, privateID, jwt, setProgress, router});

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
    }
    catch (error) {
      console.error('Error uploading content:', error);
      setErrorText('Failed to upload content. Please try again.');
    }

    if (setUploading)
      setUploading(false);
  }

  const checkForMultipleCameras = async () => {
    if (isMobileSafari()) setHasMultipleCameras(true);
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    setHasMultipleCameras(videoDevices.length > 1);
  };

  const startStream = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: facingMode },
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          aspectRatio: { ideal: 16/9 },
          frameRate: 30,
          //resizeMode: 'crop-and-scale'
          resizeMode: 'none'
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
  };

  const startRecording = async () => {
    try {
      let stream = streamRef?.current;
      if (!stream)
        stream = await startStream();
      else
        videoRef.current.srcObject = stream;
      
      setCountdown(4);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => {
        setStatus('recording');
        recorderRef.current = new RecordRTC(stream, {
          type: 'video',
          mimeType: 'video/'+fileExt,
          frameInterval: 1,
          recorderType: RecordRTC.MediaStreamRecorder
        });
        recorderRef.current.startRecording();
        setRecordingTime(0);
      }, 4000);
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

  const flipCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  return (
    <RecorderWrapper {...props}>
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        paddingTop: `${(1 / aspectRatio) * 100}%`,
        marginTop: '10px',
        marginBottom: '20px'
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
            objectFit: 'cover',
            //maxHeight: '60vh',
            //objectFit: 'contain',
            borderRadius: '10px',
            pointerEvents: status === 'recording' ? 'none' : 'auto',
            transform: facingMode === 'user' && status !== 'stopped' ? 'scaleX(-1)' : 'none'
          }}
        />
        {status !== 'stopped' && (
        <div 
          onClick={status === 'recording' ? stopRecording : (countdown === null ? startRecording : null)}
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
            cursor: countdown !== null ? 'default' : 'pointer',
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
        </div> )}
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
        {hasMultipleCameras && status !== 'stopped' && (
          <button 
            onClick={flipCamera}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10,
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
        {countdown !== null && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}>
            {countdown}
          </div>
        )}
      </div>
      
      <Progress value={progress} style={{marginBottom: '20px'}} />
      <ContentInputs style={{marginBottom: '20px'}} titleRef={titleRef} nameRef={nameRef} emailRef={emailRef} locationRef={locationRef} />      

      <ButtonGroup style={{marginBottom: '10px' }}>
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
          onClick={handleUpload}
          disabled={status !== "stopped" || !blob || uploading}
        >
          {status === "recording" ? `Recording (${formatTime(recordingTime)})` : "Submit"}
        </StyledButton>
      </ButtonGroup>
    </RecorderWrapper>
  );
}
