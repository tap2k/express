import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import { useState, useRef } from "react";
import { Progress } from "reactstrap";
import uploadSubmission from "../hooks/uploadsubmission";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, StyledButton } from './recorderstyles';
import UploadWidget from './uploadwidget';
import ContentInputs from "./contentinputs";

const AudioWidget = dynamic(() => import("../components/audiowidget"), { ssr: false });

export default function AudioRecorder({ channelID, privateID, jwt, uploading, setUploading, lat, long, ...props }) {
  const router = useRouter();
  const [blob, setBlob] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recording, setRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const titleRef = useRef();
  const nameRef = useRef();
  const locationRef = useRef();
  const emailRef = useRef();
  const extUrlRef = useRef();
  const fileExt = "mp3";

  const handleStop = (blobUrl, blob) => {
    setBlob(blob);
    setMediaBlobUrl(blobUrl);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!blob) return;

    if (setUploading) setUploading(true);

    try {
      const myFormData = new FormData();

      if (uploadedFiles.length) {
        myFormData.append('mediafile', uploadedFiles[0], uploadedFiles[0].name);
        myFormData.append('audiofile', blob, 'audio.' + fileExt);
      } else {
        myFormData.append('mediafile', blob, 'audio.' + fileExt);
      }

      await uploadSubmission({
        myFormData, 
        lat, 
        long, 
        title: titleRef.current?.value, 
        name: nameRef.current?.value, 
        email: emailRef.current?.value, 
        location: locationRef.current?.value, 
        ext_url: extUrlRef.current?.value, 
        channelID, 
        setProgress, 
        privateID, 
        jwt, 
        router
      });

      // Reset form fields and state
      [titleRef, nameRef, emailRef, locationRef, extUrlRef].forEach(ref => {
        if (ref.current) ref.current.value = "";
      });
      setProgress(0);
      setBlob(null);
      setMediaBlobUrl(null);
      setUploadedFiles([]);

    } catch (error) {
      console.error('Error uploading content:', error);
      setErrorText('Failed to upload content. Please try again.');
    }
      
    if (setUploading) setUploading(false);
  };

  return (
    <RecorderWrapper {...props}>
      <AudioWidget onStop={handleStop} mediaBlobUrl={mediaBlobUrl} fileExt={fileExt} setRecording={setRecording} />
      
      <UploadWidget progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} accept="image/*" style={{minHeight: '200px'}} />
      <Progress value={progress} style={{marginBottom: '20px'}} />

      <ContentInputs 
        style={{marginBottom: '20px'}} 
        titleRef={titleRef} 
        nameRef={jwt ? null : nameRef} 
        emailRef={true ? null : emailRef} 
        locationRef={locationRef} 
      />
      
      <StyledButton 
        color="success" 
        size="lg" 
        block 
        onClick={handleUpload}
        disabled={!blob || uploading || recording}
      >
        Submit
      </StyledButton>
    </RecorderWrapper>
  );
}