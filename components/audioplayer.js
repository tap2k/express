
export default function AudioPlayer({ src, width, height, controls, mediaRef, ...props }) 
{  
  return (
    <div 
      style={{
        position: 'relative',
        width,
        height,
        cursor: 'pointer',
        minHeight: '150px',
        ...props.style
      }} 
    >
      <audio src={src} style={{display: "none"}} ref={mediaRef} />
    </div>
  );
}
