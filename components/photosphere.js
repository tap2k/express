import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { useContainerSize } from '../hooks/usecontainersize';

export default function Photosphere({ src, width, height, controls }) {
  const navbar = controls ? ['autorotate', 'zoom', 'fullscreen'] : [];
  const { containerSize, containerRef } = useContainerSize(height);

  /* TODO: Hacky, doesnt really work
  if (!Number.isInteger(height))
  {
    if (Number.isInteger(width))
      height = width;
    else
      height = 300;
  }*/

  const containerStyle = {
    width: width || '100%',
    height: `${containerSize.height}px`
    //height: height,
  };

  return (
    <>
      <div 
        ref={containerRef}
        style={containerStyle}
        onClick={(e) => e.stopPropagation()} 
      >
        <ReactPhotoSphereViewer
          src={src}
          width="100%"
          height="100%"
          navbar={navbar}
        />
      </div>
    </>
  );
};