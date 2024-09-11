
export default function VideoPlayer({ width, height, controls, mediaRef, children }) 
{
  return (
    <div 
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#000'
      }} 
    >
      <video 
        ref={mediaRef}
        style={{
          width: '100%',
          height: '100%'
        }}
        playsInline
        preload='auto'
        controls={controls}
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        onTouchStart={(e)=>{e.preventDefault(); e.stopPropagation();}}
      >
        {children}
      </video>
    </div>
  );
}