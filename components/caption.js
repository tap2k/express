import { FaShoppingBag } from 'react-icons/fa';
import { isMediaFile } from './content';
export default function Caption({ title, subtitle, name, url, foregroundColor, textAlignment = 'center', inverted = false, size = "medium", ...props })
{
    // TODO: What about produce links?
    // if (!title && !url) return null;
    if (!title) return null;

    const overlayHex = (foregroundColor || '').replace('#', '').substring(0, 6);
    const lightOverlay = overlayHex.length === 6 && (parseInt(overlayHex.substr(0,2),16)*299 + parseInt(overlayHex.substr(2,2),16)*587 + parseInt(overlayHex.substr(4,2),16)*114) / 1000 > 128;
    const textColor = lightOverlay ? '#222' : '#fff';
    const textOutlineStyle = {
        textShadow: lightOverlay
            ? '0 1px 3px rgba(0,0,0,0.3)'
            : '-1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333',
        color: textColor
    };

    const captionStyleBase = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: foregroundColor ? foregroundColor : 'rgba(150,150,150,0.4)',
        borderRadius: '10px',
        padding: '30px 50px',
        backdropFilter: 'blur(10px)',
        width: 'max-content',
        maxWidth: '80%',
        boxSizing: 'border-box',
        textAlign: 'center',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto',
        mixBlendMode: inverted ? 'difference' : 'normal',
        pointerEvents: 'none',
        ...props.style
    };
    
    const captionStyleTop = { ...captionStyleBase, top: '2.5vh' };
    const captionStyleBottom = { ...captionStyleBase, bottom: '4vh' };
    const captionStyleCenter = { ...captionStyleBase, top: '50%', transform: 'translate(-50%, -50%)' };
    const captionStyle = 
        textAlignment === 'center' ? captionStyleCenter :
        textAlignment === 'bottom' ? captionStyleBottom : captionStyleTop;
    
    const linkStyleBase = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(100,100,100,0.4)',
        color: 'rgba(255,255,255,0.9)',
        borderRadius: '25px',
        padding: '10px 20px',
        pointerEvents: 'auto',
        fontSize: 'clamp(18px, 2.5vh, 32px)',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '80%',
        textAlign: 'center',
        mixBlendMode: inverted ? 'difference' : 'normal'
    };
    
    const linkStyleBottom = { ...linkStyleBase, bottom: 'clamp(70px, 8.5vh, 120px)' };
    const linkStyleTop = { ...linkStyleBase, top: 'clamp(50px, 2.5vh, 120px)' };
    const linkStyle = textAlignment === 'top' ? linkStyleBottom : linkStyleTop;

    const titleStyle = {
        fontSize: size === "small" ? '18px' : 
                  size === "big" ? 'clamp(48px, 6vh, 64px)' : 
                  'clamp(24px, 4vh, 48px)',
        lineHeight: size === "big" ? 1.2 : 1.3,
        fontWeight: 'bold',
        ...textOutlineStyle
    };
    
    const subtitleStyle = {
        fontSize: size === "big" ? 'clamp(24px, 4vh, 32px)' : 'clamp(18px, 2.5vh, 24px)',
        lineHeight: size === "big" ? 1.2 : 1.3,
        marginTop: '10px',
        ...textOutlineStyle
    };
    
    const nameStyle = {
        fontSize: size === "big" ? 'clamp(20px, 3.5vh, 28px)' : 'clamp(18px, 2.5vh, 24px)',
        lineHeight: size === "big" ? 1.2 : 1.3,
        textAlign: 'right',
        marginTop: '25px',
        ...textOutlineStyle
    }

    return (
        <>
            {(title || subtitle) && (
                <div style={captionStyle}>
                    {title && <div style={titleStyle}>{title}</div>}
                    {subtitle && size !== "small" && textAlignment === "center" && <div style={subtitleStyle}>{subtitle}</div>}
                    {name && size !== "small" && textAlignment === "center" && <div style={nameStyle}>{name}</div>}
                </div>
            )}
            {url && !(size === "small") && !isMediaFile(url) && (
                <a href={url} style={linkStyle} rel="noopener noreferrer" target="_blank">
                    <FaShoppingBag style={{marginRight: '8px'}} />
                    Item Link
                </a>
            )}
        </>
    );
}
