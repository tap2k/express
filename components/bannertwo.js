import React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import Link from "next/link"
import LoginButton from './loginbutton';

export default function BannerTwo({ jwt, nologin }) {
    return (
        <Navbar style={{ 
            backgroundColor: 'rgba(26, 95, 122, 0.9)', 
            color: 'white', 
            position: 'relative',
            minHeight: '60px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '15px'
        }}>
            <NavbarBrand style={{ 
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                margin: 0,
                padding: 0
            }}>
                <b style={{
                    fontSize: 'xx-large',
                    color: '#ffffff', 
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                <Link href="/" style={{ 
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        margin: 0,
                        padding: 0,
                        textDecoration: 'none',  // Remove underline from link
                        color: "#ffffff"
                }}>
                    EXPRESS
                    </Link>
            </b>
            </NavbarBrand>
            { !nologin && <div style={{ 
                position: 'absolute',
                right: '2%',  // Percentage-based right positioning
                top: '50%',
                transform: 'translateY(-50%)'
            }}>
                <LoginButton jwt={jwt} />
            </div> }
        </Navbar>
    );
}