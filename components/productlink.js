// components/productlink.js
import Link from 'next/link';
import { FaShoppingBag } from 'react-icons/fa';

export default function ProductLink({ url }) {
    if (!url) return null;

    const containerStyle = {
        position: 'absolute',
        width: 250,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        bottom: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '25px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        padding: 20
    };

    const linkStyle = {
        fontSize: 'x-large',
        fontWeight: 'bold',
        color: 'white',
        textDecoration: 'none',
        pointerEvents: 'auto'
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
