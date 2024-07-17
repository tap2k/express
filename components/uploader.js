/* components/uploader.js */

import { useRef } from "react";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
import { useRouter } from "next/router";
import useGeolocation from "react-hook-geolocation";
import useFileUpload from 'react-use-file-upload';
import uploadContent from "../hooks/uploadcontent";

async function myUploadContent (myFormData, lat, long, channelID, router) 
{
  uploadContent({myFormData: myFormData, lat: lat, long: long, channelID: channelID}); 
  const query = router?.asPath?.slice(router?.pathname?.length);
  router.push("/" + query);
}

export default function Uploader({ channelID, useLocation, ...props }) 
{
  const router = useRouter();
  const inputRef = useRef();

  let lat = null;
  let long = null;

  if (useLocation)
  {
    const geolocation = useGeolocation();
    lat = geolocation.latitude;
    long = geolocation.longitude;
  }
  
  const {
    files,
    fileNames,
    fileTypes,
    totalSize,
    totalSizeInBytes,
    handleDragDropEvent,
    clearAllFiles,
    createFormData,
    setFiles,
    removeFile,
  } = useFileUpload();

  return (
    <div {...props}>
      <Button style={{ marginTop: 10, marginLeft: 5, marginBottom: 10 }} color="primary" size="lg" onClick={() => inputRef.current.click()}><h3>select</h3></Button>
      <div className="form-container">
        <div>
          <ListGroup style={{ marginTop: 15, marginLeft: 5, marginBottom: 20, width: 300, minHeight: 50}}>
            {fileNames.map((name, index) => (
              <ListGroupItem key={index}>
                {name}
                <Button style={{ float: 'right' }} size="sm" color="primary" onClick={() => removeFile(name)}>x</Button>
              </ListGroupItem>
            ))}
          </ListGroup>
          <b style={{ marginLeft: 10 }}>Total Size:</b> {totalSize} <br/>
          <Button style={{ marginLeft: 5, marginTop: 30 }} color="primary" size="lg" onClick={() => clearAllFiles()}><h3>clear</h3></Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          //multiple
          style={{ display: 'none' }}
          accept="image/*,audio/*,video/*"
          onChange={(e) => {
            // TODO: Allow same file name?
            if (!fileNames.includes(inputRef.current.files[0].name))
              setFiles(e, 'a');
            inputRef.current.value = null;
          }}
        />
      </div>
      <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" size="lg" onClick={(e) => {e.preventDefault(); myUploadContent(createFormData(), lat, long, channelID, router)}}>
        <h3>submit</h3>
      </Button>
    </div>
  );
}

