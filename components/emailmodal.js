import { useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { StyledInput } from './recorderstyles';

export default function EmailModal ({isOpen, onSubmit, toggle, headerText, bodyText}) 
{
  const emailInputRef = useRef(null);

  const handleSubmit = () => {
    if (emailInputRef.current && emailInputRef.current.value) {
      onSubmit(emailInputRef.current.value);
      toggle();
    }
  };

  const closeBtn = (
    <button className="close" onClick={toggle} title="Close">
      &times;
    </button>
  );

  return (
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalHeader toggle={toggle} close={closeBtn}>
              {headerText}
          </ModalHeader>
          <ModalBody>
              <p>{bodyText}</p>
              <StyledInput 
              type="email" 
              placeholder="Enter your email address" 
              innerRef={emailInputRef}
              />
          </ModalBody>
          <ModalFooter>
              <Button color="primary" onClick={handleSubmit} title="Submit">Submit</Button>
              <Button color="secondary" onClick={toggle} title="Cancel">Cancel</Button>
          </ModalFooter>
        </Modal>
  );
};
