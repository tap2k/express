import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/router';
import { Progress } from "reactstrap";
import { MdFlipCameraIos, MdCamera } from 'react-icons/md';
import { createFilter } from "cc-gram";
import uploadSubmission from "../hooks/uploadsubmission";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from './recorderstyles';
import ContentInputs from "./contentinputs";

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

  useEffect(() => {
    checkForMultipleCameras();
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const checkForMultipleCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    setHasMultipleCameras(videoDevices.length > 1);
  };

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
      setErrorText("Failed to access the camera. Please check your permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const capturedDataUri = canvasRef.current.toDataURL('image/png');
      setDataUri(capturedDataUri);
      generateFilterPreviews(capturedDataUri);
    }
  };

  const handleFlipCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  const handleRetake = () => {
    setDataUri(null);
    setCurrentFilter('normal');
    setFilterPreviews({});
    startCamera();
  };

  const ccgramFilter = createFilter({ init: false });
  const filterNames = ['normal', 'moon', 'lofi', 'xpro2', 'brannan', 'gingham'];

  const applyFilter = (filter) => {
    setCurrentFilter(filter);
    setDataUri(filterPreviews[filter]);
  };

  const generateFilterPreviews = async (imageDataUri) => {
    const previews = { normal: imageDataUri };
    for (const filter of filterNames) {
      if (filter !== 'normal') {
        const img = new Image();
        img.src = imageDataUri;
        await new Promise((resolve) => { img.onload = resolve; });
        img.setAttribute('data-filter', filter);
        ccgramFilter.applyFilter();
        previews[filter] = await ccgramFilter.getDataURL(img);
      }
    }
    setFilterPreviews(previews);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (setUploading) setUploading(true);

    try {
      const formData = new FormData();
      const blob = await (await fetch(dataUri)).blob();
      if (!blob) {
        setErrorText("No image data found!");
        if (setUploading) setUploading(false);
        return;
      }

      formData.append('mediafile', blob, "image.png");
      await uploadSubmission({
        myFormData: formData,
        channelID,
        lat,
        long,
        title: titleRef.current?.value,
        name: nameRef.current?.value,
        email: emailRef.current?.value,
        location: locationRef.current?.value,
        privateID,
        jwt,
        setProgress,
        router
      });

      // Clear input fields
      [titleRef, nameRef, emailRef, locationRef].forEach(ref => {
        if (ref.current) ref.current.value = "";
      });
    } catch (error) {
      console.error('Error uploading content:', error);
      setErrorText('Failed to upload content. Please try again.');
    }

    if (setUploading) setUploading(false);
  };

  return (
    <RecorderWrapper {...props} style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
      {!dataUri ? (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button
            onClick={handleCapture}
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
            }}
          >
            <MdCamera size={36} />
          </button>
          {hasMultipleCameras && (
            <button
              onClick={handleFlipCamera}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
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
              }}
            >
              <MdFlipCameraIos size={24} />
            </button>
          )}
        </div>
      ) : (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <img 
            src={dataUri} 
            style={{
              width: '100%',
              height: '70%',
              objectFit: 'contain',
            }}
          />
          {Object.keys(filterPreviews).length === filterNames.length && (
            <div style={{ 
              display: 'flex',
              overflowX: 'auto',
              padding: '10px',
              background: 'rgba(0,0,0,0.5)',
            }}>
              {filterNames.map(filterName => (
                <div 
                  key={filterName} 
                  onClick={() => applyFilter(filterName)}
                  style={{
                    margin: '0 5px',
                    cursor: 'pointer',
                    border: currentFilter === filterName ? '2px solid blue' : '2px solid transparent',
                    borderRadius: '5px',
                    padding: '2px',
                    flexShrink: 0
                  }}
                >
                  <img 
                    src={filterPreviews[filterName]}
                    alt={filterName}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '3px'
                    }}
                  />
                  <p style={{ textAlign: 'center', fontSize: '10px', margin: '2px 0 0 0', color: 'white' }}>{filterName}</p>
                </div>
              ))}
            </div>
          )}
          <ContentInputs 
            style={{padding: '10px'}} 
            titleRef={titleRef} 
            nameRef={jwt ? null : nameRef} 
            emailRef={true ? null : emailRef} 
            locationRef={locationRef} 
          />
          <ButtonGroup style={{padding: '10px'}}>
            <StyledButton 
              color="secondary" 
              size="lg"
              onClick={handleRetake} 
              disabled={uploading}
            >
              Retake
            </StyledButton>
            <StyledButton
              color="success"
              size="lg"
              onClick={handleUpload}
              disabled={uploading}
            >
              Submit
            </StyledButton>
          </ButtonGroup>
          {uploading && <Progress value={progress} />}
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </RecorderWrapper>
  );
}