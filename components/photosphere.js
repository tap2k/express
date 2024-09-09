// components/photosphere.js

import { useRef, useEffect, useState } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';

export default function Photosphere ({ src, width, height, audioUrl, controls, mediaRef }) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width, height });

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      setContainerSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    };

    // Initial size update
    updateSize();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const navbar = controls ? ['autorotate', 'zoom', 'fullscreen'] : [];

  return (
    <>
      <div 
        ref={containerRef} 
        onClick={(e) => e.stopPropagation()} 
        style={{ width: width, height: height }}
      >
        <ReactPhotoSphereViewer
          src={src}
          width={containerSize.width}
          height={containerSize.height}
          navbar={navbar}
        />
      </div>
      {audioUrl && 
        <audio src={audioUrl} style={{display: "none"}} ref={mediaRef} />
      }
    </>
  );
};

