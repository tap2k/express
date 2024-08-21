import { FaShoppingBag } from 'react-icons/fa';
import { isMediaFile } from './content';

export default function Caption({ title, subtitle, url, textAlignment = 'center', inverted = false, size = "medium" }) 
{
    if (!title && !url) return null;

    const captionStyleBase = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(200,200,200,0.4)',
        color: 'rgba(255,255,255,1.0)',
        borderRadius: '10px',
        padding: '35px',
        backdropFilter: 'blur(5px)',
        width: 'fit-content',
        maxWidth: '80%',
        textAlign: 'center',
        pointerEvents: 'none',
        whiteSpace: 'normal',
        overflowWrap: 'break-word',
        mixBlendMode: inverted ? 'difference' : 'normal'
    };
    
    const captionStyleTop = { ...captionStyleBase, top: '4vh' };
    const captionStyleBottom = { ...captionStyleBase, bottom: '15vh' };
    const captionStyleCenter = { ...captionStyleBase, top: '50%', transform: 'translate(-50%, -50%)' };
    const captionStyle = 
        textAlignment === 'top' ? captionStyleTop :
        textAlignment === 'bottom' ? captionStyleBottom : captionStyleCenter;
    
    const linkStyleBase = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(200,200,200,0.7)',
        color: 'rgba(255,255,255,1.0)',
        borderRadius: '25px',
        padding: '10px 20px',
        pointerEvents: 'auto',
        fontSize: 'clamp(16px, 2vh, 24px)',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '80%',
        textAlign: 'center',
        mixBlendMode: inverted ? 'difference' : 'normal'
    };
    
    const linkStyleTop = { ...linkStyleBase, bottom: 'clamp(70px, 10vh, 200px)' };
    const linkStyleBottom = { ...linkStyleBase, top: '30px' };
    const linkStyle = textAlignment === 'bottom' ? linkStyleBottom : linkStyleTop;

    const titleStyle = {
        fontSize: size === "small" ? '16px' : 
                  size === "big" ? 'clamp(24px, 4vh, 48px)' : 
                  'clamp(18px, 3vh, 32px)',
        lineHeight: size === "big" ? 1.1 : 1.2,
        fontWeight: 'bold'
    };
    
    const subtitleStyle = {
        fontSize: size === "big" ? 'clamp(18px, 2vh, 32px)' : 'clamp(14px, 1.5vh, 24px)',
        lineHeight: size === "big" ? 1.2 : 1.3,
        marginTop: '10px',
    };

    return (
        <>
            {(title || subtitle) && (
                <div style={captionStyle}>
                    {title && <div style={titleStyle}>{title}</div>}
                    {subtitle && !size === "small" & <div style={subtitleStyle}>{subtitle}</div>}
                </div>
            )}
            {url && !size === "small" && !isMediaFile(url) && (
                <a href={url} style={linkStyle} rel="noopener noreferrer" target="_blank">
                    <FaShoppingBag style={{marginRight: '8px'}} />
                    Product Link
                </a>
            )}
        </>
    );
}
