import { FaShoppingBag } from 'react-icons/fa';
import { isMediaFile } from './content';

export default function Caption({ title, subtitle, url, textAlignment = 'center', inverted = false, small = false }) 
{
    if (!title && !url) return null;

    const captionStyleBase = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.4)',
        color: 'white',
        borderRadius: '10px',
        padding: '25px',
        backdropFilter: 'blur(5px)',
        width: 'fit-content',
        maxWidth: '80%',
        textAlign: 'center',
        pointerEvents: 'none',
        whiteSpace: 'normal',
        overflowWrap: 'break-word',
        mixBlendMode: inverted ? 'difference' : 'normal',
    };
    
    const captionStyleTop = { ...captionStyleBase, top: '4vh' };
    const captionStyleBottom = { ...captionStyleBase, bottom: '15vh' };
    const captionStyleCenter = { ...captionStyleBase, top: '50%', transform: 'translate(-50%, -50%)' };
    
    const captionStyle = 
        textAlignment === 'top' ? captionStyleTop :
        textAlignment === 'bottom' ? captionStyleBottom :
        captionStyleCenter;
    
    const linkStyleBase = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '25px',
        padding: '10px 20px',
        pointerEvents: 'auto',
        fontSize: 'clamp(16px, 2vh, 24px)',
        fontWeight: 'bold',
        color: 'white',
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
        fontSize: small ? '16px' : 'clamp(18px, 3vh, 32px)',
        lineHeight: 1.2,
        fontWeight: 'bold'
    };

    const subtitleStyle = {
        fontSize: 'clamp(14px, 1.5vh, 24px)',
        lineHeight: 1.3,
        marginTop: '10px',
    };

    return (
        <>
            {(title || subtitle) && (
                <div style={captionStyle}>
                    {title && <div style={titleStyle}>{title}</div>}
                    {subtitle && !small & <div style={subtitleStyle}>{subtitle}</div>}
                </div>
            )}
            {url && !small && !isMediaFile(url) && (
                <a href={url} style={linkStyle} rel="noopener noreferrer" target="_blank">
                    <FaShoppingBag style={{marginRight: '8px'}} />
                    Product Link
                </a>
            )}
        </>
    );
}
