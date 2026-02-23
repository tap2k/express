import { useRouter } from 'next/router';
import { useRef, useState } from "react";
import { Progress, Button } from "reactstrap";
import uploadSubmission from "../hooks/uploadsubmission";
import setError from '../hooks/seterror';
import { RecorderWrapper } from './recorderstyles';
// import UploadWidget from "./uploadwidget";
import MediaPicker from "./mediapicker";
import ContentInputs from "./contentinputs";

export default function FileUploader({ channelID, privateID, jwt, uploading, setUploading, lat, long, planData, ...props }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(null);
  const [selectedForegroundColor, setSelectedForegroundColor] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const titleRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const locationRef = useRef();
  const extUrlRef = useRef();

  const handleUpload = async (e) => {
    e.preventDefault();
    // if (!titleRef.current?.value && !uploadedFiles.length && !extUrlRef.current?.value)
    //   return;
    if (!uploadedFiles.length && !extUrlRef.current?.value && !selectedMedia && !selectedBackgroundColor)
      return;
    if (planData?.tierConfig?.maxFileSizeMB) {
      const maxBytes = planData.tierConfig.maxFileSizeMB * 1024 * 1024;
      for (const file of uploadedFiles) {
        if (file.size > maxBytes) {
          alert(`File "${file.name}" exceeds the ${planData.tierConfig.maxFileSizeMB} MB limit for your plan.`);
          return;
        }
      }
    }
    if (setUploading)
      setUploading(true);
    try {
      const formData = new FormData();
      uploadedFiles.forEach(file => formData.append(file.name, file, file.name));

      if (selectedMedia && selectedMedia !== "None") {
        if (selectedMedia.startsWith('data:image/png;base64,')) {
          const response = await fetch(selectedMedia);
          const blob = await response.blob();
          formData.append('dalle-image.png', blob, 'dalle-image.png');
        } else {
          const response = await fetch(`images/${selectedMedia}`);
          const blob = await response.blob();
          formData.append(selectedMedia, blob, "maustrocard-"+selectedMedia);
        }
      }

      setUploadedFiles([]);

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
        backgroundColor: selectedBackgroundColor,
        foregroundColor: selectedForegroundColor,
        privateID,
        jwt,
        setProgress,
        router
      });

      setSelectedMedia(null);
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
      {/* <UploadWidget progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} accept="image/*,audio/*,video/*" multiple /> */}
      <MediaPicker progress={progress} setProgress={setProgress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia} selectedBackgroundColor={selectedBackgroundColor} setSelectedBackgroundColor={setSelectedBackgroundColor} selectedForegroundColor={selectedForegroundColor} setSelectedForegroundColor={setSelectedForegroundColor} generating={generating} setGenerating={setGenerating} accept="image/*,audio/*,video/*" multiple dalle />
      <Progress value={progress} />
      <ContentInputs
        style={{marginTop: '15px', marginBottom: '20px'}}
        titleRef={titleRef}
        nameRef={jwt ? null : nameRef}
        emailRef={true ? null : emailRef}
        locationRef={locationRef}
        extUrlRef={extUrlRef}
      />
      <Button
        color="success"
        size="lg"
        onClick={handleUpload}
        block
        disabled={uploading || generating}
        title="Submit"
      >
        Submit
      </Button>
  </RecorderWrapper>
)}
