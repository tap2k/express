/* components/mycamera.js */

import { useState, useRef } from "react";
import { Input } from "reactstrap";
import { useRouter } from "next/router";
import useGeolocation from "react-hook-geolocation";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
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
  const descriptionRef = useRef();

  let lat = null;
  let long = null;

  if (useLocation) {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  function handleTakePhotoAnimationDone(dataUri) {
    setDataUri(dataUri);
  }

  function handleRetake() {
    setDataUri(null);
  }

  return (
    <RecorderWrapper {...props}>
      {dataUri ? (
        <>
          <img 
            src={dataUri} 
            alt="Captured" 
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              marginBottom: '20px'
            }}
          />
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
            <StyledButton color="secondary" onClick={handleRetake}>
              Retake
            </StyledButton>
            <StyledButton
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                const description = descriptionRef.current.value;
                uploadImage(dataUri, lat, long, description, channelID, router);
              }}
            >
              Submit
            </StyledButton>
          </ButtonGroup>
        </>
      ) : (
        <Camera
          onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
          idealFacingMode={FACING_MODES.USER}
          isFullscreen={false}
          imageType={IMAGE_TYPES.JPG}
          sizeFactor={1}
          imageCompression={0.8}
          isDisplayStartCameraError={true}
          isImageMirror={false}
        />
      )}
    </RecorderWrapper>
  );
}

