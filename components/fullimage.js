import useSlideAdvance from "../hooks/useslideadvance";

export default function FullImage({ src, width, height, audioUrl, controls, autoPlay, interval, mediaRef, cover, index, ...props }) 
{  
  // TODO: Just for title, a bit hacky
  useSlideAdvance({index, autoPlay, interval});

  return (
    <>
      <div 
        style={{
          position: 'relative',
          width,
          height,
          ...props.style
        }} 
      >
        { src && <img 
            src={src} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: cover ? 'cover' : 'contain'
          }} 
        />}
      </div>
      { audioUrl && <>
          <audio src={audioUrl} style={{display: "none"}} ref={mediaRef} />
        </> }
    </>
  );
}
