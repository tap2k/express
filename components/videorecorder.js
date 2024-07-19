import { useEffect, useState, useRef, useCallback } from "react";
import { Input } from "reactstrap";
import { useRouter } from "next/router";
import RecordRTC from 'recordrtc';
import useGeolocation from "react-hook-geolocation";
import uploadContent from "../hooks/uploadcontent";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, StyledButton } from '../components/recorderstyles';

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

export default function VideoRecorder({ channelID, useLocation }) {
  const router = useRouter();
  const [blob, setBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const descriptionRef = useRef();
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [aspectRatio, setAspectRatio] = useState(16.0 / 9.0); // Default to landscape

  let lat = null;
  let long = null;

  if (useLocation) {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  const startStream = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current.play();
            // Set aspect ratio based on video dimensions
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
  }, []);

  const startRecording = async () => {
    try {
      const stream = await startStream();
      recorderRef.current = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm;codecs=vp9,opus',
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

  useEffect(() => {
    startStream();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [startStream]);

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
  }

  return (
    <RecorderWrapper>
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        paddingTop: `${(1 / aspectRatio) * 100}%`,
        marginBottom: '10px'
        //margin: '0 auto',
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
            pointerEvents: status === 'recording' ? 'none' : 'auto'
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
            backgroundColor: 'rgb(255, 255, 255)', 
            border: '15px solid rgba(128, 128, 128)',
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
              backgroundColor: 'rgb(255, 255, 255)',
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
      </div>
      
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
        Submit
      </StyledButton>
    </RecorderWrapper>
  );
}
