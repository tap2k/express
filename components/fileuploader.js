import { useRouter } from 'next/router';
import { useRef, useState } from "react";
import { Progress } from "reactstrap";
import uploadSubmission from "../hooks/uploadsubmission";
import setError from '../hooks/seterror';
import { RecorderWrapper, StyledButton } from './recorderstyles';
import UploadWidget from "./uploadwidget";
import ContentInputs from "./contentinputs";

export default function FileUploader({ channelID, privateID, jwt, uploading, setUploading, lat, long, ...props }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const titleRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const locationRef = useRef();
  const extUrlRef = useRef();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!titleRef.current?.value && !uploadedFiles.length)
      return;
    if (setUploading)
      setUploading(true);
    try {
      const formData = new FormData();
      uploadedFiles.forEach(file => formData.append(file.name, file, file.name));
      
      await uploadSubmission({
        myFormData: formData, 
        channelID, 
        lat, 
        long, 
        title: titleRef.current?.value,
        name: nameRef.current?.value,
        email: emailRef.current?.value,
        location: locationRef.current?.value,
        ext_url: extUrlRef.current?.value,
        privateID,
        jwt,
        setProgress, 
        router
      }); 
      
      setUploadedFiles([]);
      if (titleRef.current)
        titleRef.current.value = "";
      if (nameRef.current)
        nameRef.current.value = "";
      if (emailRef.current)
        emailRef.current.value = "";
      if (locationRef.current)
        locationRef.current.value = "";
      if (extUrlRef.current)
        extUrlRef.current.value = "";
      setProgress(0);
    }
    catch (error) {
      console.error('Error uploading content:', error);
      setError('Failed to upload content. Please try again.');
    }

    if (setUploading)
      setUploading(false);
  }
  return (
    <RecorderWrapper  {...props}>
      <UploadWidget progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} accept="image/*,audio/*,video/*" multiple />
      <Progress value={progress} />
      <ContentInputs style={{marginTop: '15px', marginBottom: '20px'}} titleRef={titleRef} nameRef={nameRef} emailRef={emailRef} locationRef={locationRef} extUrlRef={extUrlRef} />
      <StyledButton
        color="success"
        size="lg"
        onClick={handleUpload}
        block
        disabled={uploading || (!uploadedFiles.length && !titleRef.current?.value)}
      >
        Submit
      </StyledButton>
  </RecorderWrapper>
)}
