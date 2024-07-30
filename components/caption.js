// components/caption.js
import Link from 'next/link';
import { FaShoppingBag } from 'react-icons/fa';

export default function Caption({ title, subtitle, url, textAlignment = 'center' }) {
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
            maxWidth: '80%',
            textAlign: 'center',
            pointerEvents: 'auto',
        };

        switch (textAlignment) {
            case 'top': return { ...base, top: '30px' };
            case 'bottom': return { ...base, bottom: url ? '180px' : '100px' };
            default: return { ...base, top: '50%', transform: 'translate(-50%, -50%)' };
        }
    };

    const linkStyle = {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '25px',
            padding: '10px 20px',
            width: '250px',
            pointerEvents: 'auto',
            fontSize: 'x-large',
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: '100px'
        };

    return (
        <>
            {(title || subtitle) && (
                <div style={getCaptionStyle()}>
                    {title && <div style={{fontSize: '4em', fontWeight: 'bold'}}>{title}</div>}
                    {subtitle && <div style={{fontSize: '2em'}}>{subtitle}</div>}
                </div>
            )}
            {url && (
                <Link href={url} style={linkStyle} rel="noopener noreferrer" target="_blank">
                    <FaShoppingBag style={{marginRight: 8}} />
                    Product Link
                </Link>
            )}
        </>
    );
}
