import { useRouter } from 'next/router';
import { useRef, useState } from "react";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import axios from 'axios';
import { ButtonGroup, StyledButton } from './recorderstyles'; 
import updateSubmission from "../hooks/updatesubmission";
import { getMediaInfo } from "./content";
import ContentInputs from "./contentinputs";
import ContentTagger from "./contenttagger";


function formatFileSize(bits) {
  let bytes = bits * 1000;
  if (bytes == 0) return '0 Bytes';
  var k = 1000,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function ContentEditor ({ contentItem, isModalOpen, setIsModalOpen, tagger, privateID, jwt }) {
  
  if (!contentItem)
    return;

  const titleRef = useRef();
  const descriptionRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const locationRef = useRef();
  const extUrlRef = useRef();
  const textAlignmentRef = useRef();
  const [updating, setUpdating] = useState(false);

  const router = useRouter();
  const {url, type} = getMediaInfo(contentItem, true);

  const handleSave = async () => {
    setUpdating(true);
    try {
      await updateSubmission({
        contentID: contentItem.id,
        privateID,
        jwt,
        title: titleRef?.current?.value,
        description: descriptionRef?.current?.value,
        name: nameRef?.current?.value,
        email: emailRef?.current?.value,
        location: locationRef?.current?.value,
        ext_url: extUrlRef?.current?.value, 
        textAlignment: textAlignmentRef?.current?.value
      });
      setIsModalOpen(false);
      router.replace(router.asPath, undefined, { scroll: false });
    } catch (error) {
      console.error('Error updating submission:', error);
    } finally {
      setUpdating(false);
    }
  };

  const generateCaption = async () => {
    if (!contentItem.mediafile || !contentItem.mediafile.url) {
      console.error('No image URL available');
      return;
    }

    setUpdating(true);
    try {
      const response = await axios.post('/api/chatgpt', {
        prompt: "Generate a concise and descriptive caption for this image that would be appropriate for a photo album",
        imageUrl: url
      });

      if (response.data && response.data.response) {
        titleRef.current.value = response.data.response.trim();
      }
    } catch (error) {
      console.error('Error generating caption:', error);
    } finally {
      setUpdating(false);
    }
  };

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle} title="Close">&times;</button>
  );

  return (
    <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
      <ModalHeader close={closeBtn(() => setIsModalOpen(false))}>
        {(contentItem.mediafile?.size || contentItem.audiofile?.size) &&
          <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#999' }}>
            {formatFileSize((contentItem.mediafile?.size || 0) + (contentItem.audiofile?.size || 0))}
          </span>}
      </ModalHeader>
      <ModalBody>
        <ContentInputs 
          style={{marginBottom: '15px'}} 
          contentItem={contentItem} 
          titleRef={titleRef} 
          descriptionRef={descriptionRef}
          nameRef={nameRef} 
          //emailRef={emailRef} 
          locationRef={locationRef} 
          extUrlRef={extUrlRef} 
          textAlignmentRef={textAlignmentRef} 
        />
        <ButtonGroup>
          {url && type.startsWith("image") && process.env.NEXT_PUBLIC_AI_ENABLED == "true" && (
            <StyledButton
              onClick={generateCaption}
              color="secondary"
              disabled={updating}
              title="Generate caption"
            >
              {updating ? 'Updating...' : 'Generate Caption'}
            </StyledButton>
          )}
          <StyledButton
            onClick={handleSave}
            color="primary"
            disabled={updating}
            title="Update slide"
          >
            {updating ? 'Updating...' : 'Update Slide'}
          </StyledButton>
        </ButtonGroup>
        { tagger && <ContentTagger 
          contentItem={contentItem} 
          jwt={jwt} 
          privateID={privateID} 
          style={{width: '450px', marginTop: '10px', marginBottom: '10px'}} 
          /> }
      </ModalBody>
    </Modal>
  );
};