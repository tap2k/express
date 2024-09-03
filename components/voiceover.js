import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import {  Modal, ModalHeader, ModalBody, Progress } from "reactstrap";
import { useReactMediaRecorder } from "react-media-recorder";
import updateSubmission from "../hooks/updatesubmission";
import getBaseURL from '../hooks/getbaseurl';
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, ButtonGroup, StyledButton } from './recorderstyles';
import UploadWidget from './uploadwidget';

//const fileExt = "webm";
const fileExt = "mp3";

function Output({ src }) {  
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return (
      <audio 
        src={src}
        controls 
        style={{ width: '100%', marginBottom: '10px' }}
      >
        {isSafari && <source src={src} type="audio/aac" />}
        Your browser does not support the audio element.
      </audio>
    );
  }
  
const formatTime = (seconds) => {
const minutes = Math.floor(seconds / 60);
const remainingSeconds = seconds % 60;
return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
  
export default function Voiceover({ contentItem, privateID, jwt, isModalOpen, setIsModalOpen, ...props })
{
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [recordingTime, setRecordingTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [blob, setBlob] = useState(null);
    const router = useRouter();

    const {
        status,
        error,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        mediaBlobUrl,
      } = useReactMediaRecorder({
        audio: true,
        askPermissionOnMount: true,
        blobPropertyBag: { type: "audio/" + fileExt },
        onStop: (blobUrl, blob) => setBlob(blob)
      });

      useEffect(() => {
        if (error) setErrorText(error);
      }, [error]);
    
      useEffect(() => {
        let interval;
        if (status === "recording") {
          interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } else if (status === "stopped") {
          setRecordingTime(0);
        }
        return () => clearInterval(interval);
      }, [status]);

      useEffect(() => {
        if (blob)
            setUploadedFiles([])
        else
            if (uploadedFiles.length)
            {
                console.log("setting blob null");
                setBlob(null);
            }      
      }, [blob, uploadedFiles]);
    
      const handleRecordingAction = () => {
        if (status === "recording") {
          pauseRecording();
        } else if (status === "paused") {
          resumeRecording();
        } else {
          startRecording();
        }
      };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (status === "recording" || (!blob && !uploadedFiles.length))
          return;
    
        if (setUploading)
          setUploading(true);
    
        try {
            const myFormData = new FormData();
            if (blob)
                myFormData.append('audiofile', blob, 'audio.' + fileExt);    
            else
                myFormData.append('mediafile', uploadedFiles[0], 'audio.' + fileExt);
            await updateSubmission({myFormData, contentID: contentItem.id, setProgress, privateID, jwt});
          } catch (error) {
            console.error('Error uploading content:', error);
            setErrorText('Failed to upload content. Please try again.');
          }
        
        setBlob(null);
        setUploadedFiles([]);
        setProgress(0);
        if (setUploading)
          setUploading(false);
        setIsModalOpen(false);
        router.replace(router.asPath, undefined, { scroll: false }); 
      };

      const handleDelete = async (e) => {
        e.preventDefault();
        if (status === "recording")
          return;
    
        if (setUploading)
          setUploading(true);  
        try {
            await updateSubmission({contentID: contentItem.id, deleteAudio: true, privateID, jwt});
          } catch (error) {
            console.error('Error delete', error);
            setErrorText('Failed to delete audiofile. Please try again.');
          }
        
        setBlob(null);
        setUploadedFiles([]);
        setProgress(0);
        if (setUploading)
          setUploading(false);
        setIsModalOpen(false);
        router.replace(router.asPath, undefined, { scroll: false }); 
      };

    const buttonStyle = {
        fontSize: 'medium',
        width: '100%',
        padding: '6px',
        marginTop: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#5dade2', 
        border: 'none',
        color: '#ffffff',
        fontWeight: 'bold',
    };

    const closeBtn = (toggle) => (
        <button className="close" onClick={toggle}>&times;</button>
      );    

    return (
        <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
        <ModalHeader close={closeBtn(() => setIsModalOpen(false))}></ModalHeader>
        <ModalBody>
        <RecorderWrapper {...props}>
        <ButtonGroup style={{marginBottom: '10px'}}>
            <StyledButton 
                color="primary" 
                onClick={handleRecordingAction}
                >
                {status === "recording" ? "Pause" : status === "paused" ? "Resume" : "Start"}
            </StyledButton>
            <StyledButton 
                color="secondary" 
                onClick={stopRecording}
                disabled={status != "recording"}
            >
            Stop
            </StyledButton>
        </ButtonGroup>

        <div style={{
            width: '100%',
            height: '30px',
            backgroundColor: '#e9ecef',
            borderRadius: '30px',
            overflow: 'hidden',
            marginBottom: '10px',
            position: 'relative'
        }}>
            <div style={{
            width: `${(recordingTime / 60) * 100}%`,
            height: '100%',
            backgroundColor: '#007bff',
            transition: 'width 1s linear'
            }} />
            <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: recordingTime > 150 ? 'white' : 'black',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
            }}>
            <span style={{ marginRight: '10px' }}>{formatTime(recordingTime)}</span>
            </div>
        </div>

        <Output src={uploadedFiles.length ? URL.createObjectURL(uploadedFiles[0]) : mediaBlobUrl ? mediaBlobUrl : getBaseURL() + contentItem.audiofile?.url} />
        
        <UploadWidget progress={progress} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} accept="audio/*" style={{minHeight: '200px'}} dontShowFiles />
        <Progress value={progress} style={{marginBottom: '20px'}} />

        <StyledButton 
            color="danger" 
            size="lg" 
            block 
            onClick={handleDelete}
            disabled={status === "recording" || uploading || !contentItem.audiofile?.url}
            style={{marginBottom: '10px'}}
        >
        Delete
        </StyledButton>
        <StyledButton 
            color="success" 
            size="lg" 
            block 
            onClick={handleUpload}
            disabled={status === "recording" || uploading || (!blob && uploadedFiles.length === 0)}
        >
        {status === "recording" ? `Recording (${formatTime(recordingTime)})` : "Submit"}
        </StyledButton>
    </RecorderWrapper>
    </ModalBody>
    </Modal>
)}