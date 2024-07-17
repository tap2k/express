/* components/recorder.js */

import { useEffect, useState } from "react";
import { Button, Alert } from "reactstrap";
import { useRouter } from "next/router";
import { useReactMediaRecorder } from "react-media-recorder";
import useGeolocation from "react-hook-geolocation";
import uploadContent from "../hooks/uploadcontent";

import { setErrorText } from '../hooks/seterror';

async function uploadRecording(blob, lat, long, channelID, status, router) 
{
  if (status != "stopped" || !blob)
    return;
  const formData = require('form-data');
  const myFormData = new formData();
  myFormData.append('mediafile', blob, "audio.ogg");
  await uploadContent({myFormData: myFormData, lat: lat, long: long, channelID: channelID});
  const query = router?.asPath?.slice(router?.pathname?.length);
  router.push("/" + query);
}

function Status ({status, ...props}) {
  const [counter, setCounter] = useState(0.0);

  useEffect(() => {
    if (status == "recording")
      setTimeout(() => setCounter(counter + 1), 1000);
    else if (status == "stopped")
      setCounter(0);
  }, [status, counter]);

  return <Alert color="primary" {...props}><h2>{status} : {counter}</h2></Alert>;
}

function Output({src, ...props}) {
  if (!src)
    return;
  
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari)
    return <audio controls {...props}><source src={src} type="audio/aac" /></audio>;
  else
    return <audio src={src} controls autoPlay {...props} />;
}

export default function Recorder({ channelID, useLocation, ...props }) {

  const router = useRouter();
  const [blob, setBlob] = useState();

  let lat = null;
  let long = null;

  if (useLocation)
  {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }

  const {
    status,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    isMuted,
    muteAudio,
    unMuteAudio,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
    previewStream,
    previewAudioStream
  } = useReactMediaRecorder({
    audio: true,
    askPermissionOnMount: true,
    //blobPropertyBag: { type: "audio/mp3" },
    //blobPropertyBag: { type: "audio/wav" },
    blobPropertyBag: { type: "audio/ogg" },
    onStop: (blobUrl, blob) => {setBlob(blob)}
  });

  /*useEffect(() => {
    console.info(status);
  }, [status]);*/

  useEffect(() => {
    if (error) setErrorText(error);
  }, [error]);

  return (
    <div {...props}>
      <Button style={{marginLeft: 5}} color="primary" size="lg" onClick={(e) => {e.preventDefault(); if (status == "paused") resumeRecording(); else startRecording();}}>
        <h2>start</h2>
      </Button>
      <Button style={{marginLeft: 5}} color="primary" size="lg" onClick={pauseRecording}>
        <h2>pause</h2>
      </Button>
      <Button style={{marginLeft: 5}} color="primary" size="lg" onClick={stopRecording}>
        <h2>stop</h2>
      </Button>
      <Status status={status} style={{marginTop: 20}} />
      <Output src={mediaBlobUrl} style={{marginLeft: 5, marginBottom: 20}} />
      <br/>
      <Button style={{marginLeft: 5}} color="primary" size="lg" onClick={(e) => {e.preventDefault(); uploadRecording(blob, lat, long, channelID, status, router)}}>
        <h2>submit</h2>
      </Button>
    </div>
  );

}
