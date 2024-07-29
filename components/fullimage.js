// components/fullimage.js

import Caption from "./caption";
import ProductLink from "./productlink";

export default function FullImage({ src, width, height, title, subtitle, url, centerVertically = false }) 
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
        alt={title}
      /> : "" }
      <Caption title={title} subtitle={subtitle} centerVertically={centerVertically} />
      <ProductLink url={url} />
    </div>
  );
}
