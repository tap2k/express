import { Input } from 'reactstrap';

export default function ContentInputs({ contentItem, descriptionRef, nameRef, emailRef, locationRef, extUrlRef, textAlignmentRef, ...props }) {
  const inputStyle = {
    fontSize: 'large',
    width: '100%',
    height: '50px',
    marginBottom: '10px',
    borderRadius: '12px',
    border: '1px solid #ccc',
    padding: '0 15px',
  };

  return (
    <div {...props}>
      {descriptionRef && (
        <Input
          type="textarea"
          innerRef={descriptionRef}
          placeholder="Enter text here"
          defaultValue={contentItem?.description}
          style={inputStyle}
          rows={2}
        />
      )}

      {nameRef && (
        <Input
          type="text"
          innerRef={nameRef}
          placeholder="Enter your name"
          defaultValue={contentItem?.name}
          style={inputStyle}
        />
      )}

      {emailRef && (
        <Input
          type="text"
          innerRef={emailRef}
          placeholder="Enter your email"
          defaultValue={contentItem?.email}
          style={inputStyle}
        />
      )}
      
      {locationRef && (
        <Input
          type="text"
          innerRef={locationRef}
          placeholder="Enter your location"
          defaultValue={contentItem?.location}
          style={inputStyle}
        />
      )}

      {extUrlRef && (
        <Input
          type="text"
          innerRef={extUrlRef}
          placeholder="Enter URL"
          defaultValue={contentItem?.ext_url}
          style={inputStyle}
        />
      )}

      {textAlignmentRef && (
        <Input
          type="select"
          innerRef={textAlignmentRef}
          placeholder="Select text alignment"
          defaultValue={contentItem?.textalignment || 'center'}
          style={inputStyle}
        >
          <option value="top">Top</option>
          <option value="center">Center</option>
          <option value="bottom">Bottom</option>
        </Input>
      )}
    </div>
  );
}
