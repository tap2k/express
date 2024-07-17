/* components/videorecorder.js */

import { useEffect, useState, useRef } from "react";
import { Button, Alert } from "reactstrap";
import { useRouter } from "next/router";
import { useReactMediaRecorder } from "react-media-recorder";
import useGeolocation from "react-hook-geolocation";
import getBlobDuration from 'get-blob-duration';
import ysFixWebmDuration from 'fix-webm-duration';
//import * as ebml from 'ts-ebml';
import uploadContent from "../hooks/uploadcontent";
import { setErrorText } from '../hooks/seterror';

async function uploadRecording(blob, lat, long, channelID, status, router) 
{
  if (status != "stopped" || !blob)
    return;

  getBlobDuration(blob).then(function(duration) {
    ysFixWebmDuration(blob, duration, async (fixedBlob) => {
      const formData = require('form-data');
      const myFormData = new formData();
      myFormData.append('mediafile', fixedBlob, "video.webm");
      await uploadContent({myFormData: myFormData, lat: lat, long: long, channelID: channelID});
      const query = router?.asPath?.slice(router?.pathname?.length);
      router.push("/" + query);
    });
  });
}

/*const [initialPreviewStream, setInitialPreviewStream] = useState();

const getInitialPreviewStream = async (constraints ) => {
  return new Promise<MediaStream>((resolve, reject) => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((mediaDevices) => {
        console.log(mediaDevices);
        const videoDevices = mediaDevices.filter(
          (x) => x.kind === "videoinput"
        );
        const currentDeviceID = videoDevices[0].deviceId;

        //update state.
        //set currentDeviceID.
        //set videoDevicesIDs.

        navigator.mediaDevices
          .getUserMedia(constraints)
          .catch((err) => {
            // there's a bug in chrome in some windows computers where using `ideal` in the constraints throws a NotReadableError
            if (
              err.name === "NotReadableError" ||
              err.name === "OverconstrainedError"
            ) {
              console.warn(
                `Got ${err.name}, trying getUserMedia again with fallback constraints`
              );
              return navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
              });
            }

            throw err;
          })
          .then((stream) => {
            resolve(stream);
          });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

function Output({src}) {
  if (!src)
    return;
  return <video ref={videoRef} src={src} type="video/mp4" controls autoPlay />;
}*/

function Status ({status, ...props}) 
{
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (status == "recording")
      setTimeout(() => setCounter(counter + 1), 1000);
    else if (status == "stopped")
      setCounter(0);
  }, [status, counter]);

  return <Alert color="primary" {...props}><h2>{status} : {counter}</h2></Alert>;
}

function Output ({src, stream, status, ...props}) 
{
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current)
    {
      if (stream && status != "stopped")
        videoRef.current.srcObject = stream;
      else
      {
        videoRef.current.srcObject = null;
        videoRef.current.src = src;
      }
    }
  }, [stream]);

  if (!stream && !src)
    return null;

  var controls = false;
  if (src && status == "stopped")
    controls = true;

    //return <video ref={videoRef} controls autoPlay onLoadedMetadata={() => {if (videoRef.current.duration == Infinity) videoRef.current.currentTime = 1e101;}}/>
  return  <video ref={videoRef} controls={controls} autoPlay {...props} />
};

export default function VideoRecorder({ channelID, useLocation, ...props }) 
{
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
    previewStream
  } = useReactMediaRecorder({
    video: true,
    askPermissionOnMount: true,
    //blobPropertyBag: { type: "video/mp4" },
    blobPropertyBag: { type: "video/webm" },
    onStop: (blobUrl, blob) => {setBlob(blob)},
    //render: ({ previewStream }) => {return <VideoPreview stream={previewStream} />;}
  });

  /*useEffect(() => {
    console.info(status);
  }, [status]);*/

  useEffect(() => {
    if (error) setErrorText(error);
  }, [error]);

  return (
    <div {...props}>
      <Button style={{marginLeft: 10}} color="primary" size="lg" onClick={(e) => {e.preventDefault; if (status == "paused") resumeRecording(); else startRecording();}}>
        <h2>start</h2>
      </Button>
      <Button style={{marginLeft: 10}} color="primary" size="lg" onClick={pauseRecording}>
        <h2>pause</h2>
      </Button>
      <Button style={{marginLeft: 10}} color="primary" size="lg" onClick={stopRecording}>
        <h2>stop</h2>
      </Button>
      <Status status={status} style={{marginTop: 15}} />
      <p/>
      <Output src={mediaBlobUrl} stream={previewStream} status={status} style={{marginLeft: 10}} />
      <br/>
      <Button style={{marginLeft: 10, marginTop: 15}} color="primary" size="lg" onClick={(e) => {e.preventDefault(); uploadRecording(blob, lat, long, channelID, status, router)}}>
        <h2>submit</h2>
      </Button>
    </div>
  );

}
