import { FaShoppingBag } from 'react-icons/fa';
import { isMediaFile } from './content';

export default function Caption({ title, subtitle, name, url, textAlignment = 'center', inverted = false, size = "medium", ...props }) 
{
    if (!title && !url) return null;

    const captionStyleBase = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(200,200,200,0.4)',
        color: 'rgba(255,255,255,0.9)',
        borderRadius: '10px',
        padding: '30px',
        backdropFilter: 'blur(5px)',
        width: 'max-content',
        maxWidth: '80%',
        boxSizing: 'border-box',
        textAlign: 'center',
        pointerEvents: 'none',
        whiteSpace: 'normal',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        hyphens: 'auto',
        mixBlendMode: inverted ? 'difference' : 'normal',
        ...props.style
    };
    
    const captionStyleTop = { ...captionStyleBase, top: '3.5vh' };
    const captionStyleBottom = { ...captionStyleBase, bottom: '5vh' };
    const captionStyleCenter = { ...captionStyleBase, top: '50%', transform: 'translate(-50%, -50%)' };
    const captionStyle = 
        textAlignment === 'top' ? captionStyleTop :
        textAlignment === 'bottom' ? captionStyleBottom : captionStyleCenter;
    
    const linkStyleBase = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(200,200,200,0.4)',
        color: 'rgba(255,255,255,0.9)',
        borderRadius: '25px',
        padding: '10px 20px',
        pointerEvents: 'auto',
        fontSize: 'clamp(16px, 2.5vh, 24px)',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '80%',
        textAlign: 'center',
        mixBlendMode: inverted ? 'difference' : 'normal'
    };
    
    const linkStyleBottom = { ...linkStyleBase, bottom: 'clamp(70px, 10vh, 120px)' };
    const linkStyleTop = { ...linkStyleBase, top: '2.5vh' };
    const linkStyle = textAlignment === 'top' ? linkStyleBottom : linkStyleTop;

    const textOutlineStyle = {
        textShadow: `
            -1px -1px 0 #333,  
             1px -1px 0 #333,
            -1px  1px 0 #333,
             1px  1px 0 #333
        `,
        color: '#fff'
    };
    
    const titleStyle = {
        fontSize: size === "small" ? '16px' : 
                  size === "big" ? 'clamp(24px, 4vh, 48px)' : 
                  'clamp(18px, 3vh, 32px)',
        lineHeight: size === "big" ? 1.1 : 1.2,
        fontWeight: 'bold',
        ...textOutlineStyle
    };
    
    const subtitleStyle = {
        fontSize: size === "big" ? 'clamp(18px, 2vh, 32px)' : 'clamp(14px, 1.5vh, 24px)',
        lineHeight: size === "big" ? 1.2 : 1.3,
        marginTop: '10px',
        ...textOutlineStyle
    };
    
    const nameStyle = {
        fontSize: size === "small" ? '14px' : 
                    size === "big" ? 'clamp(18px, 2.5vh, 32px)' : 
                    'clamp(16px, 2vh, 24px)',
        lineHeight: size === "big" ? 1.2 : 1.3,
        textAlign: 'right',
        marginTop: '25px',
        ...textOutlineStyle
    };

    return (
        <>
            {(title || subtitle) && (
                <div style={captionStyle}>
                    {title && <div style={titleStyle}>{title}</div>}
                    {subtitle && !size === "small" && <div style={subtitleStyle}>{subtitle}</div>}
                    {name && <div style={nameStyle}>{name}</div>}
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
