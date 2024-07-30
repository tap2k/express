// components/fullimage.js

export default function FullImage({ src, width, height }) 
{
  return (
    <div style={{ position: 'relative', width, height }}>
       { src ? <img 
        src={src} 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }} 
      /> : "" }
    </div>
  );
}
