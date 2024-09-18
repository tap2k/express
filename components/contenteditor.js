import { useRouter } from 'next/router';
import { useRef, useState } from "react";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import axios from 'axios';
import updateSubmission from "../hooks/updatesubmission";
import { getMediaInfo } from "./content";
import ContentInputs from "./contentinputs";
import { ButtonGroup, StyledButton } from './recorderstyles'; // Import your styled components

export default function ContentEditor ({ contentItem, isModalOpen, setIsModalOpen, privateID, jwt }) {
  
  if (!contentItem)
    return;

  const titleRef = useRef();
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
    <button className="close" onClick={toggle}>&times;</button>
  );

  return (
    <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
      <ModalHeader close={closeBtn(() => setIsModalOpen(false))}></ModalHeader>
      <ModalBody>
        <ContentInputs 
          style={{marginBottom: '15px'}} 
          contentItem={contentItem} 
          titleRef={titleRef} 
          //nameRef={nameRef} 
          //emailRef={emailRef} 
          locationRef={locationRef} 
          //extUrlRef={extUrlRef} 
          textAlignmentRef={textAlignmentRef} 
        />
        <ButtonGroup>
          {url && type.startsWith("image") && process.env.NEXT_PUBLIC_AI_ENABLED == "true" && (
            <StyledButton 
              onClick={generateCaption} 
              color="secondary" 
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Generate Caption'}
            </StyledButton>
          )}
          <StyledButton 
            onClick={handleSave} 
            color="primary" 
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Slide'}
          </StyledButton>
        </ButtonGroup>
      </ModalBody>
    </Modal>
  );
};