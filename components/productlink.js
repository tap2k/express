// components/productlink.js
import Link from 'next/link';
import { FaShoppingBag } from 'react-icons/fa';

export default function ProductLink({ url }) {
    if (!url) return null;

    const containerStyle = {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        bottom: 100,
        animation: 'float 3s ease-in-out infinite',
    };

    const linkStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        borderRadius: '25px',
        padding: '10px 20px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        color: 'white',
        textDecoration: 'none',
        pointerEvents: 'auto',
        transition: 'all 0.3s ease'
    };

    return (
        <div style={containerStyle}>
            <Link 
                href={url} 
                style={{
                    ...linkStyle,
                }}
                rel="noopener noreferrer" target="_blank"
            >
                <FaShoppingBag style={{marginRight: 8}} />
                    Product Link
            </Link>
        </div>
    );
}
