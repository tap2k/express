// components/fullimage.js

import { useRef } from "react";
import Caption from "./caption";
import ProductLink from "./productlink";

export default function FullImage({ src, width, height, caption, url }) 
{
  const imgRef = useRef();

  return (
    <div style={{ position: 'relative', width, height }}>
      <img 
        src={src} 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }} 
        ref={imgRef}
        alt={caption}
      />
      <Caption caption={caption} />
      <ProductLink url={url} />
    </div>
  );
}
