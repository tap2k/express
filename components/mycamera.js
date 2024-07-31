import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from "react";
import { Input } from "reactstrap";
import useGeolocation from "react-hook-geolocation";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { MdFlipCameraIos } from 'react-icons/md';
import uploadSubmission from "../hooks/uploadsubmission";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';
import { createFilter } from "cc-gram";
import axios from 'axios';

async function uploadImage(dataUri, lat, long, description, ext_url, channelID, router) 
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
    await uploadSubmission({myFormData, lat, long, description, ext_url, published: true, channelID, router});
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

export default function MyCamera({ channelID, useLocation, dalle, ...props }) {
  const router = useRouter();
  const descriptionRef = useRef();
  const extUrlRef = useRef();
  const dallePromptRef = useRef();
  const [dataUri, setDataUri] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('normal');
  const [filterPreviews, setFilterPreviews] = useState({});
  const [isGeneratingDalle, setIsGeneratingDalle] = useState(false);
  const [isDalleImage, setIsDalleImage] = useState(false);

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
    setIsDalleImage(false);
    const previews = await generateFilterPreviews(myDataUri);
    setFilterPreviews(previews);
  }

  async function handleDalleGeneration() {
    setIsGeneratingDalle(true);
    try {
      const response = await axios.post('/api/dalle', {
        prompt: dallePromptRef?.current?.value
      });

      const imageBase64 = response.data.imageBase64;
      const myDataUri = `data:image/png;base64,${imageBase64}`;

      setDataUri(myDataUri);
      setIsDalleImage(true);
      setFilterPreviews({});
    } catch (error) {
      console.error('Error generating DALL-E image:', error);
      setErrorText('Failed to generate AI image. Please try again.');
    } finally {
      setIsGeneratingDalle(false);
    }
  }

  async function applyFilter(filter) {
    if (isDalleImage) return; // Don't apply filters to DALL-E images
    setCurrentFilter(filter);
    setDataUri(filterPreviews[filter]);
  }

  async function generateFilterPreviews(imageDataUri) {
    if (isDalleImage) return {}; // Don't generate previews for DALL-E images
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
    setIsDalleImage(false);
  }

  function handleFlipCamera() {
    setFacingMode(prevMode => 
      prevMode === FACING_MODES.USER ? FACING_MODES.ENVIRONMENT : FACING_MODES.USER
    );
  }

  return (
    <RecorderWrapper {...props}>
      <div style={{ marginTop: '10px', marginBottom: '20px', position: 'relative' }}>
        {dataUri ? (
          <div>
            <img 
              src={dataUri} 
              alt="Captured or Generated" 
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px'
              }}
            />
            {!isDalleImage && Object.keys(filterPreviews).length === filterNames.length && (
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
        ) : isGeneratingDalle ? (
          <div style={{
            width: '100%',
            minHeight: '600px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            borderRadius: '10px'
          }}>
            <p>Generating DALL-E Image...</p>
          </div>
        ) : (
          <>
            <Camera
              onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
              idealFacingMode={facingMode || FACING_MODES.USER}
              isFullscreen={false}
              imageType={IMAGE_TYPES.PNG}
              sizeFactor={1}
              isDisplayStartCameraError={true}
              isImageMirror={facingMode !== FACING_MODES.ENVIRONMENT}
            />
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
      <Input
        type="text"
        innerRef={extUrlRef}
        placeholder="Enter URL"
        style={{ width: '100%', marginBottom: '25px' }}
      />
      { dalle ? <Input
        type="text"
        innerRef={dallePromptRef}
        placeholder="Enter AI prompt"
        style={{ width: '100%', marginBottom: '25px' }}
      /> : "" }
      <ButtonGroup style={{marginBottom: '10px' }}>
        <StyledButton 
          color="secondary" 
          size="lg"
          onClick={handleRetake} 
          disabled={!dataUri && !isGeneratingDalle}
        >
          Retake
        </StyledButton>
        { dalle ? <StyledButton
          color="primary"
          size="lg"
          onClick={handleDalleGeneration}
          disabled={isGeneratingDalle}
        >
          {isGeneratingDalle ? 'Generating...' : 'Generate AI Image'}
        </StyledButton> : "" }
        <StyledButton
          color="success"
          size="lg"
          onClick={(e) => {
            e.preventDefault();
            const description = descriptionRef.current.value;
            const ext_url = extUrlRef.current.value;
            uploadImage(dataUri, lat, long, description, ext_url, channelID, router);
            descriptionRef.current.value = "";
            extUrlRef.current.value = "";
            if (dallePromptRef?.current)
              dallePromptRef.current.value = "";
          }}
          disabled={!dataUri || isGeneratingDalle}
        >
          Submit
        </StyledButton>
      </ButtonGroup>
    </RecorderWrapper>
  );
}
