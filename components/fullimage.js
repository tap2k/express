import { useRef } from "react";
import useSlideAdvance from "../hooks/useslideadvance";

export default function FullImage({ src, width, height, audioUrl, controls, autoPlay, interval, mediaRef, cover, index, ...props }) 
{  
  const imgRef = useRef(null);

  // TODO: Just for title, a bit hacky
  useSlideAdvance({index, autoPlay, interval});

  const fullscreen = () => {
    if (!controls)
      return;
    if (imgRef.current.requestFullscreen) {
        imgRef.current.requestFullscreen();
        /*imgRef.current.requestFullscreen({ navigationUI: "show" }).then(e => {console.log("fullscreened")}).catch(err => {
          alert(`An error occurred while trying to switch into full-screen mode: ${err.message} (${err.name})`);
        });*/
    } else if (imgRef.current.msRequestFullscreen) {
        imgRef.current.msRequestFullscreen();
    } else if (imgRef.current.mozRequestFullScreen) {
        imgRef.current.mozRequestFullScreen();
    } else if (imgRef.current.webkitRequestFullscreen) {
        imgRef.current.webkitRequestFullscreen();
    } else {
        alert("Sorry, your browser is too old and doesn't support fullscreen")
    }
  }

  return (
    <>
      <div 
        style={{
          position: 'relative',
          width,
          height,
          ...props.style
        }} 
      >
        {src ? (
          <img 
            src={src} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: cover ? 'cover' : 'contain'
            }}
            ref={imgRef}
            onDoubleClick={fullscreen}
          />
        ) : (
          <div style={{
            width: '100%',
            paddingBottom: '80%', // This creates a 16:9 aspect ratio
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }} />
  )}
      </div>
      { audioUrl && <>
          <audio src={audioUrl} style={{display: "none"}} ref={mediaRef} />
        </> }
    </>
  );
}
