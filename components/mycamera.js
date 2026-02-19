import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from "react";
import { Progress } from "reactstrap";
import { MdFlipCameraIos } from 'react-icons/md';
import { createFilter } from "cc-gram";
import uploadSubmission from "../hooks/uploadsubmission";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from './recorderstyles';
import ContentInputs from "./contentinputs";

function isMobileSafari() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) && !window.MSStream && /Safari/.test(ua) && !/Chrome/.test(ua);
}

export default function MyCamera({ channelID, privateID, jwt, uploading, setUploading, lat, long, ...props }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [dataUri, setDataUri] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('normal');
  const [filterPreviews, setFilterPreviews] = useState({});
  const [countdown, setCountdown] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const locationRef = useRef();
  const extUrlRef = useRef();

  useEffect(() => {
    checkForMultipleCameras();
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing the camera", err);
    }
  };

  const handleUpload = async (e) =>  
    {
      e.preventDefault();
      if (setUploading)
        setUploading(true);

      try {
        const formData = require('form-data');
        const myFormData = new formData();
        
        const blob = await (await fetch(dataUri)).blob();
        if (!blob)
        {
          setErrorText("No blob found!");
          if (setUploading)
            setUploading(false);
          return; 
        }
  
        myFormData.append('mediafile', blob, "image.png");
        await uploadSubmission({myFormData, channelID, lat, long, title: titleRef.current?.value, name: nameRef.current?.value, email: emailRef.current?.value, location: locationRef.current?.value, privateID, jwt, setProgress, router});
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

  const ccgramFilter = createFilter({ init: false });
  const filterNames = ['normal', 'moon', 'lofi', 'xpro2', 'brannan', 'gingham'];

  async function applyFilter(filter) {
    setCurrentFilter(filter);
    setDataUri(filterPreviews[filter]);
  }

  async function generateFilterPreviews(imageDataUri) {
    const previews = { normal: imageDataUri };
    for (let i = 0; i < filterNames.length; i++) {
      const filter = filterNames[i];
      if (filter !== 'normal') {
        const img = new Image();
        img.src = imageDataUri;
        await new Promise((resolve) => { img.onload = resolve; });
        img.setAttribute('data-filter', filter);
        ccgramFilter.applyFilter();
        previews[filter] = await ccgramFilter.getDataURL(img);
      }
    }
    return previews;
  }

  async function capturePhoto() {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const myDataUri = canvasRef.current.toDataURL('image/png');
      setDataUri(myDataUri);
      const previews = await generateFilterPreviews(myDataUri);
      setFilterPreviews(previews);
    }
  }
  
  function handleRetake() {
    setDataUri(null);
    setCurrentFilter('normal');
    setFilterPreviews({});
    setCountdown(null);
    startCamera();
  }

  const startCountdown = () => {
    setCountdown(4);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          capturePhoto();
          return null;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  function handleFlipCamera() {
    setFacingMode(prevMode => 
      prevMode === 'user' ? 'environment' : 'user'
    );
    startCamera();
  }

  return (
    <RecorderWrapper {...props}>
      <div style={{ marginTop: '10px', marginBottom: '10px', position: 'relative' }}>
        {dataUri ? 
          <div>
            <img 
              src={dataUri} 
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px'
              }}
            />
            {Object.keys(filterPreviews).length === filterNames.length && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
                {filterNames.map(filterName => (
                  <div 
                    key={filterName} 
                    onClick={() => applyFilter(filterName)}
                    style={{
                      margin: '5px',
                      cursor: 'pointer',
                      border: currentFilter === filterName ? '2px solid blue' : '2px solid transparent',
                      borderRadius: '5px',
                      padding: '2px'
                    }}
                  >
                    <img 
                      src={filterPreviews[filterName]}
                      alt={filterName}
                      data-filter={filterName}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '3px'
                      }}
                    />
                    <p style={{ textAlign: 'center', fontSize: '12px', margin: '2px 0 0 0' }}>{filterName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          : 
          <div style={{ position: 'relative' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '10px'
              }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
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
            <button
              onClick={startCountdown}
              disabled={countdown !== null || uploading}
              title="Take photo"
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1,
                background: 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {countdown === null ? null : countdown}
            </button>
            {hasMultipleCameras && (
              <button onClick={handleFlipCamera}
                title="Flip camera"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 1,
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
              >
                <MdFlipCameraIos size={24} />
              </button>
            )}
          </div>
        }
      </div>

      { dataUri && <Progress value={progress} /> }
      <ContentInputs 
        style={{marginBottom: '20px'}} 
        titleRef={titleRef} 
        nameRef={jwt ? null : nameRef} 
        emailRef={true ? null : emailRef} 
        locationRef={locationRef} 
      />

      <ButtonGroup style={{marginBottom: '10px' }}>
        <StyledButton
          color="secondary"
          size="lg"
          onClick={handleRetake}
          disabled={!dataUri || uploading}
          title="Retake photo"
        >
          Retake
        </StyledButton>
        <StyledButton
          color="success"
          size="lg"
          onClick={handleUpload}
          disabled={!dataUri || uploading}
          title="Submit photo"
        >
          Submit
        </StyledButton>
      </ButtonGroup>
    </RecorderWrapper>
  );
}