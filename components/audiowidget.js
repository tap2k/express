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
      {isSafari && <source src={src} type="audio/mp3" />}
      Your browser does not support the audio element.
    </audio>
  );
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function AudioWidget({ onStop, mediaBlobUrl, setRecording }) {
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
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const webmBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        // Convert WebM to MP3
        const reader = new FileReader();
        reader.onload = async (e) => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioBuffer = await audioContext.decodeAudioData(e.target.result);
          
          const offlineContext = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
          );
          
          const source = offlineContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(offlineContext.destination);
          source.start(0);
          
          const renderedBuffer = await offlineContext.startRendering();
          
          const mp3Blob = await new Promise((resolve) => {
            const worker = new Worker('/path/to/lame.min.js');
            worker.postMessage({ cmd: 'init', config: { bitrate: 128 } });
            worker.postMessage({ cmd: 'encode', buf: renderedBuffer.getChannelData(0) });
            worker.postMessage({ cmd: 'finish' });
            worker.onmessage = (e) => {
              if (e.data.cmd === 'end') {
                resolve(new Blob(e.data.buf, { type: 'audio/mp3' }));
              }
            };
          });
          
          const url = URL.createObjectURL(mp3Blob);
          onStop(url, mp3Blob, audioBuffer.duration);
        };
        reader.readAsArrayBuffer(webmBlob);
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
          color: recordingTime > 30 ? 'white' : 'black',
          fontWeight: 'bold'
        }}>
          {formatTime(recordingTime)}
        </div>
      </div>

      {mediaBlobUrl && <Output src={mediaBlobUrl} />}
    </>
  );
}