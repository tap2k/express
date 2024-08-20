import { useRouter } from 'next/router';
import { useRef } from "react";
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import updateSubmission from "../hooks/updatesubmission";
import ContentInputs from "./contentinputs";

export default function ContentEditor ({ contentItem, isModalOpen, setIsModalOpen, slideshow=false }) {
  
  if (!contentItem)
    return;

  const descriptionRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const locationRef = useRef();
  const extUrlRef = useRef();
  const textAlignmentRef = useRef();

  const router = useRouter();

  const buttonStyle = {
    fontSize: 'large',
    width: '100%',
    padding: '10px',
    marginTop: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const handleSave = async () => {
    await updateSubmission({
      contentID: contentItem.id,
      description: descriptionRef?.current?.value,
      name: nameRef?.current?.value,
      email: emailRef?.current?.value,
      location: locationRef?.current?.value,
      ext_url: extUrlRef?.current?.value, 
      textAlignment: textAlignmentRef?.current?.value
    });
    setIsModalOpen(false);
    await router.replace(router.asPath);
  };
  
  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle}>&times;</button>
  );

  return (
    <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
      <ModalHeader close={closeBtn(() => setIsModalOpen(false))}></ModalHeader>
      <ModalBody>
        <ContentInputs style={{marginBottom: '5px'}} contentItem={contentItem} descriptionRef={descriptionRef} nameRef={nameRef} emailRef={emailRef} locationRef={locationRef} extUrlRef={extUrlRef} textAlignmentRef={slideshow ? textAlignmentRef : null} />
        <Button
          onClick={handleSave}
          style={{...buttonStyle}}
          color="primary" 
        >
          Update Slide
        </Button>
      </ModalBody>
    </Modal>
  );
};

