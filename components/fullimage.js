import useSlideAdvance from '../hooks/useslideadvance';

export default function FullImage({ src, width, height, audioUrl, controls, autoPlay, interval, mediaRef, cover, index }) 
{
  useSlideAdvance(
    index, 
    autoPlay && !audioUrl, 
    interval
  );
  
  return (
      <div 
        style={{
          position: 'relative',
          width,
          height,
          cursor: 'pointer'
        }} 
      >
        { src ? <img 
            src={src} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: cover ? 'cover' : 'contain'
          }} 
        /> : "" }
        { audioUrl ? <>
            <audio src={audioUrl} style={{display: "none"}} ref={mediaRef} />
          </> : ""
        }
      </div>
  );
}
