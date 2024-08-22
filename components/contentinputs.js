import { StyledInput } from './recorderstyles';

export default function ContentInputs({ contentItem, titleRef, nameRef, emailRef, locationRef, extUrlRef, textAlignmentRef, ...props }) {

  return (
    <div {...props}>
      {titleRef && (
        <StyledInput
          type="textarea"
          innerRef={titleRef}
          placeholder="Enter text here"
          defaultValue={contentItem?.title}
          rows={2}
        />
      )}

      {nameRef && (
        <StyledInput
          type="text"
          innerRef={nameRef}
          placeholder="Enter your name"
          defaultValue={contentItem?.name}
        />
      )}

      {emailRef && false && (
        <StyledInput
          type="text"
          innerRef={emailRef}
          placeholder="Enter your email"
          defaultValue={contentItem?.email}
        />
      )}
      
      {locationRef && (
        <StyledInput
          type="text"
          innerRef={locationRef}
          placeholder="Enter your location"
          defaultValue={contentItem?.location}
        />
      )}

      {extUrlRef && false && (
        <StyledInput
          type="text"
          innerRef={extUrlRef}
          placeholder="Enter URL"
          defaultValue={contentItem?.ext_url}
        />
      )}

      {textAlignmentRef && (
        <StyledInput
          type="select"
          innerRef={textAlignmentRef}
          placeholder="Select text alignment"
          defaultValue={contentItem?.textalignment || 'center'}
        >
          <option value="top">Top</option>
          <option value="center">Center</option>
          <option value="bottom">Bottom</option>
        </StyledInput>
      )}
    </div>
  );
}
