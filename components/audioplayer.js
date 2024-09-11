import React, { useEffect, useRef, useState } from 'react';

export default function AudioPlayer({ src, width, height, oscilloscope, controls, mediaRef, ...props }) {
  const [isSetup, setIsSetup] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!mediaRef.current || !oscilloscope || isSetup) return;

    const setupAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (!sourceNodeRef.current) {
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(mediaRef.current);
      }

      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }

      analyserRef.current.fftSize = 2048;
      setIsSetup(true);
    };

    const initializeAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      setupAudio();
    };

    mediaRef.current.addEventListener('play', initializeAudio);

    return () => {
      if (mediaRef.current) {
        mediaRef.current.removeEventListener('play', initializeAudio);
      }
    };
  }, [mediaRef, oscilloscope, isSetup]);

  useEffect(() => {
    if (!oscilloscope || !isSetup || !containerRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const containerHeight = containerRef.current.clientHeight;
      const containerWidth = containerRef.current.clientWidth;
      const controlsHeight = controls ? 50 : 0;
      
      canvas.width = containerWidth;
      canvas.height = containerHeight - controlsHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function draw() {
      animationFrameRef.current = requestAnimationFrame(draw);

      analyserRef.current.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = props.style?.backgroundColor ? props.style?.backgroundColor : 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 255, 0)';

      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isSetup, oscilloscope, props]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width,
        height,
        minHeight: '150px',
        display: 'flex',
        flexDirection: 'column',
        ...props.style
      }} 
    >
      {oscilloscope && (
        <div style={{ flex: 1, position: 'relative' }}>
          <canvas 
            ref={canvasRef} 
            style={{
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%'
            }} 
          />
        </div>
      )}
      {controls ? (
        <div style={{ height: '20px', width: '100%' }}>
          <audio 
            src={src}
            ref={mediaRef}
            style={{ width: '100%', height: '100%' }}
            crossOrigin="anonymous"
          />
        </div>
      ) : (
        <audio 
          src={src}
          style={{ display: "none" }} 
          ref={mediaRef}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
}