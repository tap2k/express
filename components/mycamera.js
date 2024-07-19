/* components/mycamera.js */

import { useState, useRef, useEffect } from "react";
import { Input } from "reactstrap";
import { useRouter } from "next/router";
import useGeolocation from "react-hook-geolocation";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { MdFlipCameraIos } from 'react-icons/md';
import uploadContent from "../hooks/uploadcontent";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

async function uploadImage (dataURI, lat, long, description, channelID, router) 
{
  const formData = require('form-data');
  const myFormData = new formData();
  const blob = await (await fetch(dataURI)).blob();
  if (!blob)
  {
    setErrorText("No blob found!");
    return; 
  }
  myFormData.append('mediafile', blob, "image.png");
  await uploadContent({myFormData, lat, long, description, published: true, channelID});
  const query = router?.asPath?.slice(router?.pathname?.length);
  router.push("/" + query);
}

export default function MyCamera({ channelID, useLocation, ...props }) {
  const router = useRouter();
  const [dataUri, setDataUri] = useState(null);
  const [facingMode, setFacingMode] = useState(FACING_MODES.USER);
  const descriptionRef = useRef();

  let lat = null;
  let long = null;

  if (useLocation) {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  useEffect(() => {
    async function checkCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length <= 1) {
          setFacingMode(null);  // If there's only one camera, we don't need to switch
        }
      } catch (error) {
        console.error('Error checking for multiple cameras:', error);
        setFacingMode(null);  // In case of error, disable camera switching
      }
    }
    checkCameras();
  }, []);

  function handleTakePhotoAnimationDone(dataUri) {
    setDataUri(dataUri);
  }

  function handleRetake() {
    setDataUri(null);
  }

  function handleFlipCamera() {
    setFacingMode(prevMode => 
      prevMode === FACING_MODES.USER ? FACING_MODES.ENVIRONMENT : FACING_MODES.USER
    );
  }

  return (
    <RecorderWrapper {...props}>
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        {dataUri ? (
          <img 
            src={dataUri} 
            alt="Captured" 
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px'
            }}
          />
        ) : (
          <>
            <Camera
              onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
              idealFacingMode={facingMode || FACING_MODES.USER}
              isFullscreen={false}
              imageType={IMAGE_TYPES.JPG}
              sizeFactor={1}
              imageCompression={0.8}
              isDisplayStartCameraError={true}
              isImageMirror={facingMode !== FACING_MODES.ENVIRONMENT}
            />
            {facingMode && (
              <button 
                onClick={handleFlipCamera}
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
                <MdFlipCameraIos size={24} color="rgb(255, 255, 255)" />
              </button>
            )}
          </>
        )}
      </div>
      <Input
        type="text"
        innerRef={descriptionRef}
        placeholder="Enter text"
        style={{
          width: '100%',
          marginBottom: '10px'
        }}
      />
      <ButtonGroup>
        <StyledButton color="secondary" onClick={handleRetake} disabled={!dataUri}>
          Retake
        </StyledButton>
        <StyledButton
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            const description = descriptionRef.current.value;
            uploadImage(dataUri, lat, long, description, channelID, router);
          }}
          disabled={!dataUri}
        >
          Submit
        </StyledButton>
      </ButtonGroup>
    </RecorderWrapper>
  );
}