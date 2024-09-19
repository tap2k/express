import { useEffect, useState, useRef } from "react";
import { setErrorText } from '../hooks/seterror';
import { ButtonGroup, StyledButton } from './recorderstyles';

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

export default function AudioWidget({ onStop, mediaBlobUrl, setRecording, fileExt=".mp3"  }) {
  const [recordingTime, setRecordingTime] = useState(0);
  const [status, setStatus] = useState("idle");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    let interval;
    if (status === "recording") {
      interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } else if (status === "stopped") {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: `audio/${fileExt.substr(1)}` });
        const url = URL.createObjectURL(blob);
        
        // Get the correct duration
        const audio = new Audio(url);
        audio.addEventListener('loadedmetadata', () => {
          const duration = audio.duration;
          // Create a new blob with the correct duration
          const newBlob = new Blob(chunksRef.current, { type: `audio/${fileExt}` });
          const newUrl = URL.createObjectURL(newBlob);
          onStop(newUrl, newBlob, duration);
        });
      };

      mediaRecorder.start();
      setStatus("recording");
      setRecording(true);
    } catch (error) {
      setErrorText(error.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === "recording") {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setStatus("stopped");
      setRecording(false);
    }
  };

  const handleRecordingAction = () => {
    if (status === "recording") {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      <ButtonGroup style={{marginBottom: '10px'}}>
        <StyledButton 
          color="primary" 
          onClick={handleRecordingAction}
        >
          {status === "recording" ? "Stop" : "Start"}
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

      {mediaBlobUrl && <Output src={mediaBlobUrl} />}
    </>
  );
}