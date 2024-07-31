import Link from 'next/link';
import { FaShoppingBag } from 'react-icons/fa';

export default function Caption({ title, subtitle, url, textAlignment = 'center', inverted = false }) {
    if (!title && !subtitle && !url) return null;
    
    const getCaptionStyle = () => {
        const base = {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            borderRadius: '15px',
            padding: '20px',
            backdropFilter: 'blur(5px)',
            width: 'fit-content',
            maxWidth: '80%',
            textAlign: 'center',
            pointerEvents: 'none',
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
            mixBlendMode: inverted ? 'difference' : 'normal',
        };
    
        switch (textAlignment) {
            case 'top': return { ...base, top: '30px' };
            case 'bottom': return { ...base, bottom: '90px' };
            default: return { ...base, top: '48%', transform: 'translate(-50%, -50%)' };
        }
    };

    const getLinkStyle = () => {
        const base = {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '25px',
            padding: '10px 20px',
            pointerEvents: 'none',
            fontSize: 'calc(1.5vmin + 0.5em)',
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '80%',
            textAlign: 'center',
            mixBlendMode: inverted ? 'difference' : 'normal',
        };

        switch (textAlignment) {
            case 'bottom': return { ...base, top: '30px' };
            default: return { ...base, bottom: '90px' };
        }
    };

    const titleStyle = {
        fontSize: 'calc(2.5vmin + 0.8em)',
        fontWeight: 'bold',
        lineHeight: 1.2,
        marginBottom: '10px'
    };

    const subtitleStyle = {
        fontSize: 'calc(1.5vmin + 0.5em)',
        lineHeight: 1.3
    };

    return (
        <>
            {(title || subtitle) && (
                <div style={getCaptionStyle()}>
                    {title && <div style={titleStyle}>{title}</div>}
                    {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
                </div>
            )}
            {url && (
                <Link href={url} style={getLinkStyle()} rel="noopener noreferrer" target="_blank">
                    <FaShoppingBag style={{marginRight: '8px'}} />
                    Product Link
                </Link>
            )}
        </>
    );
}
