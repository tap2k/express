import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Progress } from "reactstrap";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import updateSubmission from "../hooks/updatesubmission";
import getMediaURL from "../hooks/getmediaurl";
import { setErrorText } from '../hooks/seterror';
import { RecorderWrapper, StyledButton } from './recorderstyles';
import UploadWidget from './uploadwidget';

const AudioRecorder = dynamic(() => import("./audiorecorder"), { ssr: false });

export default function Voiceover({ contentItem, privateID, jwt, isModalOpen, setIsModalOpen }) {

    if (!isModalOpen) {
        return null;
    }

    const [uploading, setUploading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [progress, setProgress] = useState(0);
    const [blob, setBlob] = useState(null);
    const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
    const router = useRouter();
    const fileExt = "mp3";

    const handleStop = (blobUrl, blob) => {
        setBlob(blob);
        setMediaBlobUrl(blobUrl);
    };

    useEffect(() => {
        if (blob)
            setUploadedFiles([])
        else if (uploadedFiles.length) {
            setBlob(null);
            setMediaBlobUrl(null);
        }
    }, [blob, uploadedFiles]);

    useEffect(() => {
        setBlob(null);
        setMediaBlobUrl(null);
        setUploadedFiles([]);
        setProgress(0);
        setUploading(false);
    }, [isModalOpen]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!blob && !uploadedFiles.length) return;

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
        
        setIsModalOpen(false);
        router.replace(router.asPath, undefined, { scroll: false }); 
    };

    const doDelete = async () => {
        try {
            await updateSubmission({contentID: contentItem.id, deleteAudio: true, privateID, jwt});
        } catch (error) {
            console.error('Error delete', error);
            setErrorText('Failed to delete audiofile. Please try again.');
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        setIsModalOpen(false);
        confirmAlert({
          title: `Delete item?`,
          message: `Are you sure you want to delete this voiceover?`,
          buttons: [
            {
              label: 'Yes',
              onClick: async () => {
                await doDelete();
              }
            },
            {
              label: 'No',
              onClick: () => {}
            }
          ]
        });
      };

    const closeBtn = (toggle) => (
        <button className="close" onClick={toggle}>&times;</button>
    );

    return (
        <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
            <ModalHeader close={closeBtn(() => setIsModalOpen(false))}></ModalHeader>
            <ModalBody>
                <RecorderWrapper>
                    <AudioRecorder 
                        onStop={handleStop} 
                        uploadedFiles={uploadedFiles} 
                        mediaBlobUrl={mediaBlobUrl ? mediaBlobUrl : getMediaURL() + contentItem.audiofile?.url} 
                        contentItem={contentItem} 
                        fileExt={fileExt}
                        setRecording={setRecording}
                    />
                    
                    <UploadWidget 
                        progress={progress} 
                        uploadedFiles={uploadedFiles} 
                        setUploadedFiles={setUploadedFiles} 
                        accept="audio/*" 
                        style={{minHeight: '200px'}} 
                    />
                    <Progress value={progress} style={{marginBottom: '20px'}} />

                    <StyledButton 
                        color="danger" 
                        size="lg" 
                        block 
                        onClick={handleDelete}
                        disabled={recording || uploading || !contentItem.audiofile?.url || uploadedFiles.length || blob}
                        style={{marginBottom: '10px'}}
                    >
                        Delete
                    </StyledButton>
                    <StyledButton 
                        color="success" 
                        size="lg" 
                        block 
                        onClick={handleUpload}
                        disabled={recording || uploading || (!blob && uploadedFiles.length === 0)}
                    >
                        Submit
                    </StyledButton>
                </RecorderWrapper>
            </ModalBody>
        </Modal>
    );
}