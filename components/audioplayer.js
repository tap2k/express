
export default function AudioPlayer({ src, width, height, controls, mediaRef }) 
{  
  return (
    <div 
      style={{
        position: 'relative',
        width,
        height,
        cursor: 'pointer',
        minHeight: '150px',
        backgroundColor: 'black'
      }} 
    >
      <audio src={src} style={{display: "none"}} ref={mediaRef} />
    </div>
  );
}
