
export default function VideoPlayer({ width, height, controls, mediaRef, children }) 
{
  return (
    <div 
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor: '#000',
        cursor: 'pointer'
      }} 
    >
      <video 
        ref={mediaRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        playsInline
        preload='auto'
        controls={controls}
        controlsList="nodownload nofullscreen noremoteplayback"
      >
        {children}
      </video>
    </div>
  );
}