import { useRef } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';

export default function Photosphere ({ src, width, height, audioUrl, controls, mediaRef }) {

  const navbar = controls ? [/*'autorotate', 'zoom',*/ 'fullscreen'] : [];

  return (
    <>
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ width: width || '100%', height: height || '400px' }}
      >
        <ReactPhotoSphereViewer
          src={src}
          width="100%"
          height="100%"
          navbar={navbar}
        />
      </div>
      {audioUrl && 
        <audio src={audioUrl} style={{display: "none"}} ref={mediaRef} />
      }
    </>
  );
};