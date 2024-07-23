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
import { createFilter } from "cc-gram";

async function uploadImage(dataUri, lat, long, description, channelID, router) 
{
  const formData = require('form-data');
  const myFormData = new formData();
  const blob = await (await fetch(dataUri)).blob();
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
  const [currentFilter, setCurrentFilter] = useState('normal');
  const [filterPreviews, setFilterPreviews] = useState({});

  const ccgramFilter = createFilter({ init: false });
  //const filterNames = ['normal', ...ccgramFilter.filterNames];
  //const filterNames = ['normal', 'clarendon', 'valencia', 'mayfair', 'hudson', 'lofi', 'xpro2', 'gingham', 'nashville', '1977', 'aden', 'inkwell', 'reyes', 'toaster', 'walden', 'earlybird', 'brooklyn', 'lark', 'moon', 'willow', 'rise', 'slumber', 'brannan', 'maven', 'stinson', 'amaro'];
  const filterNames = ['normal', 'moon', 'lofi', 'xpro2', 'brannan', 'gingham'];

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
          setFacingMode(null);
        }
      } catch (error) {
        console.error('Error checking for multiple cameras:', error);
        setFacingMode(null);
      }
    }
    checkCameras();
  }, []);

  async function handleTakePhotoAnimationDone(dataUri) {
    setDataUri(dataUri);
    const previews = await generateFilterPreviews(dataUri);
    setFilterPreviews(previews);
  }

  async function applyFilter(filter) {
    setCurrentFilter(filter);
    setDataUri(filterPreviews[filter]);
  }

  async function generateFilterPreviews(imageDataUri) {
    const previews = {};
    for (const filter of filterNames) {
      if (filter === 'normal') {
        previews[filter] = imageDataUri;
      } else {
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
    setOriginalDataUri(null);
    setCurrentFilter('normal');
    setFilterPreviews({});
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
          <div>
            <img 
              src={dataUri} 
              alt="Captured" 
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px'
              }}
            />
            {Object.keys(filterPreviews).length === filterNames.length ? (
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
            ) : ""}
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
            {facingMode && (
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
