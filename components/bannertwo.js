import React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import LoginButton from './loginbutton';

export default function BannerTwo({ user, jwt, nologin }) {
    return (
        <Navbar style={{
            backgroundColor: 'rgba(26, 95, 122, 0.9)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '15px',
            padding: '8px 16px'
        }}>
            <NavbarBrand style={{ margin: 0, padding: 0 }}>
                <b style={{
                    fontSize: 'xx-large',
                    color: '#ffffff',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                    EXPRESS
                </b>
            </NavbarBrand>
            {!nologin &&
                <LoginButton user={user} jwt={jwt}
                    style={{ position: 'absolute', right: '16px' }}
                />}
        </Navbar>
    );
}