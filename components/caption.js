// components/caption.js

export default function Caption({ caption }) {

    if (!caption)
        return;

    const captionStyle = {
        top: 30,
        position: 'absolute',
        maxHeight: "25%",
        overflowY: "auto",
        width: 'max-content',
        maxWidth: '80%', 
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        fontSize: 'xxx-large', // Fixed font size
        //fontFamily: "'Quicksand', sans-serif",
        borderRadius: '15px',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingTop: '10px',
        paddingBottom: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(5px)',
    };

    return (
        <div style={captionStyle}>
          {caption}
        </div>
    );
};
