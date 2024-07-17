/* components/mycamera.js */

import { useState } from "react";
import { Button } from "reactstrap";
import { useRouter } from "next/router";
import useGeolocation from "react-hook-geolocation";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import uploadContent from "../hooks/uploadcontent";
import { setErrorText } from '../hooks/seterror';

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

  if (useLocation)
  {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  function handleTakePhotoAnimationDone (dataUri) {
    setDataUri(dataUri);
  }

  return (
    <div {...props}>
    {
      (dataUri)    
        ? <div>
            <img style={{marginLeft: 20}} src={dataUri} /><br/>
            <Button style={{padding: 15, marginLeft: 20, marginTop: 20}} color="primary" size="lg" onClick={(e) => {e.preventDefault(); uploadImage(dataUri, lat, long, channelID, router)}}>
              <h2>submit</h2>
            </Button>
          </div>
        : <div>
            <Camera
              onTakePhotoAnimationDone = { (dataUri) => { handleTakePhotoAnimationDone(dataUri); } }
              idealFacingMode = {FACING_MODES.ENVIRONMENT} 
              isFullscreen = {false}
              imageType = {IMAGE_TYPES.PNG}
              isDisplayStartCameraError = {true}
            />
          </div>  
    }
    </div>
  );
  
}

