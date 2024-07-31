export default function FullImage({ src, width, height }) 
{
  //if (!src)
  //  src = "images/flowers6.png";
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
