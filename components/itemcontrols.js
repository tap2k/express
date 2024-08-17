import { useRouter } from 'next/router';
import { useState, useRef } from "react";
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { FaGripVertical, FaEdit, FaTrash } from 'react-icons/fa';
import updateSubmission from '../hooks/updatesubmission';
import ContentInputs from "./contentinputs";

export default function itemControls ({ contentItem, onDelete }) {

  if (!contentItem)
    return;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const descriptionRef = useRef();
  const extUrlRef = useRef();
  const nameRef = useRef();
  const locationRef = useRef();

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
      description: descriptionRef.current.value,
      ext_url: extUrlRef.current.value
    });
    setIsModalOpen(false);
    await router.replace(router.asPath);
  };

  const closeBtn = (toggle) => (
    <button className="close" onClick={toggle}>&times;</button>
  );

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 5,
        right: 5,
        display: 'flex',
        gap: '5px',
        zIndex: 1000
      }}>
        <button 
          style={{ 
            background: 'rgba(255, 255, 255, 0.5)', 
            border: 'none', 
            borderRadius: '50%', 
            padding: '5px',
            cursor: 'move'
          }}
        >
          <FaGripVertical size={20} color="rgba(0, 0, 0, 0.5)" />
        </button>
        <button 
          onClick={() => {
            setIsModalOpen(true);
          }} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            border: 'none', 
            borderRadius: '50%', 
            padding: '5px' 
          }}
        >
          <FaEdit size={20} color="rgba(0, 0, 0, 0.5)"/>
        </button>
        <button 
          onClick={() => onDelete(contentItem.id)} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            border: 'none', 
            borderRadius: '50%', 
            padding: '5px' 
          }}
        >
          <FaTrash size={20} color="rgba(0, 0, 0, 0.5)" />
        </button>
      </div>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}>
        <ModalHeader close={closeBtn(() => setIsModalOpen(false))}></ModalHeader>
        <ModalBody>
          <ContentInputs style={{marginBottom: '5px'}} contentItem={contentItem} descriptionRef={descriptionRef} extUrlRef={extUrlRef} />
          <Button
            onClick={handleSave}
            style={{...buttonStyle}}
            color="primary" 
          >
            Update Slide
          </Button>
        </ModalBody>
      </Modal>
    </>
  );
};

