/* components/fullimage.js */

import { useRef } from "react";

export default function FullImage ({ src, width, height, caption }) 
{
  const imgRef = useRef(null);

  /*const fullscreen = () => {
    if (imgRef.current.requestFullscreen) {
        imgRef.current.requestFullscreen();
    } else if (imgRef.current.msRequestFullscreen) {
        imgRef.current.msRequestFullscreen();
    } else if (imgRef.current.mozRequestFullScreen) {
        imgRef.current.mozRequestFullScreen();
    } else if (imgRef.current.webkitRequestFullscreen) {
        imgRef.current.webkitRequestFullscreen();
    } else {
        alert("Sorry, your browser is too old and doesn't support fullscreen")
    }
  }*/

  const itemtag = <div><img src={src} style={{width: width, height: height, objectFit: 'contain'}} ref={imgRef} /></div>;
  return (
    caption ? 
      <div style={{position: 'relative'}}>{itemtag}<div style={{position: 'absolute', top: 50, maxHeight: "20%", overflowY: "auto", width: "70%", left: "15%", backgroundColor: 'rgba(0,0,0,.5)', color: 'rgba(255,255,255,1.0)', textAlign: 'center', whiteSpace: 'pre-wrap', fontSize: "xxx-large"}}>{caption}</div></div>
      : itemtag
  )
}

