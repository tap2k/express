/* components/imageadder.js */

import { useRef } from 'react';
import { Button } from "reactstrap";
import getMediaURL from "../hooks/getmediaurl";

export default function ImageAdder ({ currPic, placeholder, fileNames, submit, handleDragDropEvent, setFiles, removeFile, deletePic, setDeletePic, height, ...props }) 
{  
  const inputRef = useRef();
  const url = currPic?.formats?.small?.url ? currPic.formats.small.url : currPic?.url;

  return (
    <div {...props}>
    { url && !deletePic ?
      <div style={{display: 'inline-block', position: 'relative'}}>
        { setDeletePic ? <span onClick={() => {setDeletePic(true)}} style={{position: 'absolute', right: 5, zIndex: 100}}>&times;</span> : ""}
        <img height={height} src={getMediaURL() + url} />
      </div>
      : <div>
          <div style={{border: '1px solid rgba(150,150,150,0.5)', width: '100%', height: height, margin: 'auto', position: 'relative'}}
            onDragEnter={handleDragDropEvent}
            onDragOver={handleDragDropEvent}
            onDrop={(e) => {
              handleDragDropEvent(e);
              setFiles(e, 'w');
            }}>
            <p style={{textAlign: 'center', top: 5, left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto'}}>{placeholder ? placeholder : "add image here"}</p>
            <div style={{wordWrap: 'break-word', textAlign: 'center', position: 'absolute', top: 25, left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto'}}>
              {fileNames.map((name, index) => (
                      <div key={index}>{name}<Button style={{marginLeft: 5}}size="sm" onClick={() => removeFile(name)}>x</Button><br/></div>
              ))}
            </div>
          { submit ?
              <span>
                <div style={{textAlign: 'center', position: 'absolute', bottom: 50, left:0, right: 0, marginLeft: 'auto', marginRight: 'auto'}}><Button color="primary" size="sm" onClick={() => inputRef.current.click()}>select</Button></div>
                <div style={{textAlign: 'center', position: 'absolute', bottom: 10, left:0, right: 0, marginLeft: 'auto', marginRight: 'auto'}}><Button color="primary" size="sm" onClick={async(e) => submit(e)}>submit</Button></div> 
              </span>
            :
              <span> 
                <div style={{textAlign: 'center', position: 'absolute', bottom: 5, left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto'}}>
                  <Button color="primary" size="sm" onClick={() => inputRef.current.click()}>select</Button>
                </div>
              </span> 
          }
        </div> 
      <input
        ref={inputRef}
        type="file"
        style={{display: 'none'}}
        accept="image/*"
        onChange={(e) => {
          // TODO: Allow same file name?
          //if (!fileNames.includes(inputRef.current.files[0].name))
          setFiles(e, 'w');
          inputRef.current.value = null;
        }}/>
    </div> }
    </div>
  );
  
};