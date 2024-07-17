/* components/mycamera.js */

import { useState } from "react";
import { useRouter } from "next/router";
import useGeolocation from "react-hook-geolocation";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import uploadContent from "../hooks/uploadcontent";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from '../components/recorderstyles';

async function uploadImage (dataURI, lat, long, channelID, router) 
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
  await uploadContent({myFormData: myFormData, lat: lat, long: long, channelID: channelID});
  const query = router?.asPath?.slice(router?.pathname?.length);
  router.push("/" + query);
}

export default function MyCamera({ channelID, useLocation, ...props }) {
  const router = useRouter();
  const [dataUri, setDataUri] = useState(null);

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
          <ButtonGroup>
            <StyledButton color="secondary" onClick={handleRetake}>
              Retake
            </StyledButton>
            <StyledButton
              color="primary"
              onClick={() => uploadImage(dataUri, lat, long, channelID, router)}
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

