import { Input } from 'reactstrap'; 

export default function ContentInputs ({ contentItem, descriptionRef, nameRef, emailRef, locationRef, extUrlRef, ...props }) {
  return (
    <div {...props}>
      {descriptionRef && (
        <Input
          type="textarea"
          innerRef={descriptionRef}
          placeholder="Enter text here"
          defaultValue={contentItem?.description}
          style={{
            width: '100%',
            marginBottom: '5px',
            minHeight: '80px',
            resize: 'vertical'
          }}
          rows={2}
        />
      )}

      {nameRef && (
        <Input
          type="text"
          innerRef={nameRef}
          placeholder="Enter your name"
          style={{ width: '100%', marginBottom: '5px' }}
        />
      )}

      {emailRef && (
        <Input
          type="text"
          innerRef={emailRef}
          placeholder="Enter your email"
          style={{ width: '100%', marginBottom: '5px' }}
        />
      )}
      
      {false && locationRef && (
        <Input
          type="text"
          innerRef={locationRef}
          placeholder="Enter your location"
          style={{ width: '100%' }}
        />
      )}

      {extUrlRef && (
        <Input
          type="text"
          innerRef={extUrlRef}
          placeholder="Enter URL"
          defaultValue={contentItem?.ext_url}
          style={{ width: '100%', marginBottom: '5px' }}
        />
      )}
    </div>
  );
};

