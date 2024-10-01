import { StyledInput } from './recorderstyles';

export default function ContentInputs({ contentItem, titleRef, nameRef, descriptionRef, emailRef, locationRef, extUrlRef, textAlignmentRef, ...props }) {

  // TODO: Add some of these inputs back in
  
  return (
    <div {...props}>
      {titleRef && (
        <StyledInput
          type="textarea"
          innerRef={titleRef}
          placeholder="Enter title here"
          defaultValue={contentItem?.title}
          rows={2}
        />
      )}

      {descriptionRef && (
        <StyledInput
          type="textarea"
          innerRef={descriptionRef}
          placeholder="Enter description here"
          defaultValue={contentItem?.description}
          rows={4}
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

      {emailRef && (
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

      {extUrlRef && (
        <StyledInput
          type="text"
          innerRef={extUrlRef}
          placeholder="Enter URL (google photos, youtube, vimeo, dropbox)"
          defaultValue={contentItem?.ext_url}
        />
      )}

      {textAlignmentRef && (
        <StyledInput
          type="select"
          innerRef={textAlignmentRef}
          placeholder="Select text alignment"
          defaultValue={contentItem?.textalignment || 'top'}
        >
          <option value="top">Top</option>
          <option value="center">Center</option>
          <option value="bottom">Bottom</option>
        </StyledInput>
      )}
    </div>
  );
}
