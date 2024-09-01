import { useRouter } from 'next/router';
import { useRef, useState } from "react";
import { Progress } from "reactstrap";
import uploadSubmission from "../hooks/uploadsubmission";
import setError from '../hooks/seterror';
import { imageOptions } from './fileoptions';
import { RecorderWrapper, StyledButton } from './recorderstyles';
import ImageGallery from "./imagegallery";
import ContentInputs from "./contentinputs";

export default function GreetingCard({ channelID, privateID, jwt, uploading, setUploading, lat, long, ...props }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [generating, setGenerating] = useState(false);
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
      
      setSelectedImage(null);
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
    finally {
      if (setUploading)
        setUploading(false);
    }
  }

  return (
    <RecorderWrapper  {...props}>
      <ImageGallery imageOptions={imageOptions} selectedImage={selectedImage} setSelectedImage={setSelectedImage} uploading={generating} setUploading={setGenerating} setProgress={setProgress} />
      <Progress value={progress} />
      <ContentInputs style={{marginTop: '20px', marginBottom: '20px'}} titleRef={titleRef} nameRef={nameRef} emailRef={emailRef} locationRef={locationRef} extUrlRef={extUrlRef} />
      <StyledButton
        color="success"
        size="lg"
        onClick={handleUpload}
        block
        disabled={uploading || generating || (!titleRef.current?.value && !selectedImage) }
      >
        Submit
      </StyledButton>
  </RecorderWrapper>
)}