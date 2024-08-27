import { useRouter } from 'next/router';
import { useRef, useState } from "react";
import { Button } from "reactstrap";
import uploadSubmission from "../hooks/uploadsubmission";
import setError from '../hooks/seterror';
import { RecorderWrapper } from './recorderstyles';
import MediaPicker from "./mediapicker";
import ContentInputs from "./contentinputs";

export default function FileUploader({ channelID, uploading, setUploading, lat, long, ...props }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
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

      if (selectedImage && selectedImage !== "None") {
        if (selectedImage.startsWith('data:image/png;base64,')) {
          // This is a DALL-E generated image
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          formData.append('dalle-image.png', blob, 'dalle-image.png');
        } else {
          // This is a regular gallery image
          const response = await fetch(`images/${selectedImage}`);
          const blob = await response.blob();
          formData.append(selectedImage, blob, "maustrocard-"+selectedImage);
        }
      }
      
      await uploadSubmission({
        myFormData: formData, 
        channelID, 
        lat, 
        long, 
        title: titleRef?.current?.value,
        name: nameRef?.current?.value,
        email: emailRef?.current?.value,
        location: locationRef?.current?.value,
        ext_url: extUrlRef?.current?.value, 
        setProgress, 
        router
      }); 
      
      setSelectedImage(null);
      setUploadedFiles([]);
      setProgress(0);
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
      <MediaPicker progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} selectedMedia={selectedImage} setSelectedMedia={setSelectedImage} uploading={uploading} setUploading={setUploading} handleUpload={handleUpload} accept="image/*,audio/*,video/*" multiple gallery="image" />
      <ContentInputs style={{marginTop: '20px', marginBottom: '20px'}} titleRef={titleRef} nameRef={nameRef} emailRef={emailRef} locationRef={locationRef} extUrlRef={extUrlRef} />
      <Button
        color="success"
        onClick={handleUpload}
        block
        disabled={uploading}
      >
        Submit
      </Button>
  </RecorderWrapper>
)}
