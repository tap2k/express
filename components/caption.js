// components/caption.js

export default function Caption({ title, subtitle, centerVertically = false }) {
    if (!title && !subtitle) return null;

    const captionStyle = {
        //filter: 'invert(100%) grayscale(100%)',
        //mixBlendMode: 'difference',
        position: 'absolute',
        maxHeight: "50%", // Increased to accommodate both title and subtitle
        overflowY: "auto",
        width: 'max-content',
        maxWidth: '80%', 
        left: '50%',
        transform: centerVertically ? 'translate(-50%, -50%)' : 'translateX(-50%)',
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        borderRadius: '15px',
        padding: '20px 40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(5px)',
    };

    // Adjust top positioning based on centerVertically
    captionStyle.top = centerVertically ? '50%' : 30;

    const titleStyle = {
        fontSize: '4em',
        fontWeight: 'bold',
        marginBottom: subtitle ? '10px' : '0',
    };

    const subtitleStyle = {
        fontSize: '2em',
    };

    return (
        <div style={captionStyle}>
            {title && <div style={titleStyle}>{title}</div>}
            {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
        </div>
    );
}
