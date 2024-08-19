import { useState, useRef, useEffect } from "react";
import useGeolocation from "react-hook-geolocation";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { MdFlipCameraIos } from 'react-icons/md';
import { createFilter } from "cc-gram";
import uploadSubmission from "../hooks/uploadsubmission";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';
import ContentInputs from "./contentinputs";

async function uploadImage(dataUri, lat, long, description, name, email, location, ext_url, channelID, router) 
{
  const formData = require('form-data');
  const myFormData = new formData();
  try {
    const blob = await (await fetch(dataUri)).blob();
    if (!blob)
    {
      setErrorText("No blob found!");
      return; 
    }
    myFormData.append('mediafile', blob, "image.png");
    await uploadSubmission({myFormData, lat, long, description, name, email, location, ext_url, published: true, channelID, router});
  }
  catch (error) {
    console.error('Error uploading content:', error);
    setErrorText('Failed to upload content. Please try again.');
  }
}

function isMobileSafari() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) && !window.MSStream && /Safari/.test(ua) && !/Chrome/.test(ua);
}

export default function MyCamera({ channelID, useLocation, ...props }) {
  const [dataUri, setDataUri] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('normal');
  const [filterPreviews, setFilterPreviews] = useState({});
  const [countdown, setCountdown] = useState(null);
  const descriptionRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const locationRef = useRef();
  const extUrlRef = useRef();

  const ccgramFilter = createFilter({ init: false });
  const filterNames = ['normal', 'moon', 'lofi', 'xpro2', 'brannan', 'gingham'];

  let lat = null;
  let long = null;

  if (useLocation) {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  useEffect(() => {
    checkForMultipleCameras();
  }, []);

  const checkForMultipleCameras = async () => {
    if (isMobileSafari()) setHasMultipleCameras(true);
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    setHasMultipleCameras(videoDevices.length > 1);
  };

  const startCountdown = () => {
    setCountdown(4);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          // Trigger photo capture when countdown reaches 0
          document.querySelector('#outer-circle').click();
          return null;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  async function handleTakePhotoAnimationDone(myDataUri) {
    // unmirror the image if it was taken with the front camera
    if (facingMode !== FACING_MODES.ENVIRONMENT) {
      const img = new Image();
      img.src = myDataUri;
      await new Promise((resolve) => { img.onload = resolve; });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.scale(-1, 1);
      ctx.drawImage(img, -img.width, 0);
      myDataUri = canvas.toDataURL('image/png');
    }
    setDataUri(myDataUri);
    const previews = await generateFilterPreviews(myDataUri);
    setFilterPreviews(previews);
  }

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
  
  function handleRetake() {
    setDataUri(null);
    setCurrentFilter('normal');
    setFilterPreviews({});
    setCountdown(null);
  }

  function handleFlipCamera() {
    setFacingMode(prevMode => 
      prevMode === FACING_MODES.USER ? FACING_MODES.ENVIRONMENT : FACING_MODES.USER
    );
  }

  return (
    <RecorderWrapper {...props}>
      <div style={{ marginTop: '10px', marginBottom: '20px', position: 'relative' }}>
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
            <Camera
              onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
              idealFacingMode={facingMode || FACING_MODES.USER}
              isFullscreen={false}
              imageType={IMAGE_TYPES.PNG}
              sizeFactor={1}
              isDisplayStartCameraError={true}
              isImageMirror={facingMode !== FACING_MODES.ENVIRONMENT}
            />
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
              disabled={countdown !== null}
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
              {countdown === null ? /*'📷'*/ null : countdown}
            </button>
            {hasMultipleCameras && (
              <button onClick={handleFlipCamera}
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

      <ContentInputs style={{marginBottom: '20px'}} descriptionRef={descriptionRef} nameRef={nameRef} emailRef={emailRef} locationRef={locationRef} extUrlRef={extUrlRef} />

      <ButtonGroup style={{marginBottom: '10px' }}>
        <StyledButton 
          color="secondary" 
          size="lg"
          onClick={handleRetake} 
          disabled={!dataUri}
        >
          Retake
        </StyledButton>
        <StyledButton
          color="success"
          size="lg"
          onClick={(e) => {
            e.preventDefault();
            uploadImage(dataUri, lat, long, descriptionRef.current?.value, nameRef.current?.value, emailRef.current?.value, locationRef.current?.value, extUrlRef.current?.value, channelID, router);
            descriptionRef.current.value = "";
            extUrlRef.current.value = "";
          }}
          disabled={!dataUri}
        >
          Submit
        </StyledButton>
      </ButtonGroup>
    </RecorderWrapper>
  );
}
