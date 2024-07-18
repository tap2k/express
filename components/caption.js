// components/caption.js

export default function Caption({ caption, inverted = false, style }) {
    const baseStyle = {
      position: 'absolute',
      maxHeight: "20%",
      overflowY: "auto",
      width: "70%",
      left: "15%",
      textAlign: 'center',
      whiteSpace: 'pre-wrap',
      fontSize: "xxx-large",
    };
  
    const regularStyle = {
      ...baseStyle,
      top: 50,
      backgroundColor: 'rgba(0,0,0,.5)',
      color: 'rgba(255,255,255,1.0)',
    };
  
    const invertedStyle = {
      ...baseStyle,
      filter: 'invert(100%) grayscale(100%)',
      mixBlendMode: 'difference',
      top: '50%',
      transform: "translate(0, -50%)",
      padding: '0 15%',
      boxSizing: 'border-box',
    };
  
    const finalStyle = inverted ? invertedStyle : regularStyle;
  
    return (
      <div style={{...finalStyle, ...style}}>
        {inverted ? (
          <span style={{width: '100%', display: 'inline-block'}}>
            <b>{caption}</b>
          </span>
        ) : (
          caption
        )}
      </div>
    );
  };