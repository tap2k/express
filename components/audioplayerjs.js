import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js'
import 'videojs-errors';
import '../node_modules/video.js/dist/video-js.css';

export default function AudioPlayer({ src, width, height, oscilloscope, controls, mediaRef, player, setPlayer, setDuration, ...props }) {
  const [isSetup, setIsSetup] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!mediaRef.current) 
      return;

    mediaRef.props = {bigPlayButton: false, userActions: {hotkeys: true}, controlBar: {fadeTime: 1000, autoHide: true, pictureInPictureToggle: false, fullscreenToggle: false}, ...mediaRef.props};
    const player = videojs(mediaRef.current, mediaRef.props, function onPlayerReady() {
      
      if (!this || typeof this.on !== 'function')
        return;
      this.on('loadedmetadata', () => {if (setDuration) setDuration(mediaRef.current.duration)});

      var timeout;
      this.on('useractive', function() {
        if (!player?.controlBar?.el())
          return;
        player.controlBar.show();
        player.controlBar.el().style.opacity = 1;
        clearTimeout(timeout);
      });

      this.on('play', function() {
        player.userActive(true);
      });

      this.on('pause', function() {
        player.userActive(true);
      });
  
      this.on('userinactive', function() {
        timeout = setTimeout(function() {
          if (!player?.controlBar?.el())
            return;
          player.controlBar.el().style.opacity = 0;
        }, 1000); 
      });
    });

    if (player)
      setPlayer(player);

    return () => {
      if (player)
          player.dispose();
    }
  }, [mediaRef]);

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
      const controlsHeight = controls ? 30 : 0;
      
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

      canvasCtx.lineWidth = 4;
      canvasCtx.strokeStyle = 'rgb(0, 255, 0)';

      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        //const amplitudeScale = 1.0; // Adjust this value between 0 and 1
        //const y = (v - 1) * amplitudeScale * canvas.height / 2 + canvas.height / 2;

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
  }, [isSetup, oscilloscope]);

  return (
    <div 
      ref={containerRef}
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        ...props.style
      }} 
    >
      {oscilloscope && (
        <div style={{ flex: 1, position: 'relative', minHeight: '200px', paddingTop: '56.25%' }}>
          <canvas 
            ref={canvasRef} 
            style={{
              position: 'absolute', 
              top: controls? 10 : 0, 
              left: 0, 
              width: '100%', 
              height: '100%'
            }} 
          />
        </div>
      )}
      <div style={{ height: oscilloscope ? '20px' : 'auto', width: '100%', zIndex: 100}}>
        <audio 
          ref={mediaRef}
          style={{ 
            width: '100%', 
            height: '100%', 
          }}
          className={`video-js vjs-default-skin`}
          crossOrigin="anonymous"
          controls={controls}
        >
          <source src={src} />
        </audio>
      </div>
    </div>
  );
}