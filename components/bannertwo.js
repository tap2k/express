import React from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import LoginButton from './loginbutton';

export default function BannerTwo({ user, jwt, nologin }) {
    return (
        <Navbar style={{
            background: 'linear-gradient(160deg, #1a5f7a 0%, #2a7a94 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            marginBottom: '15px',
            padding: '14px 20px'
        }}>
            <NavbarBrand style={{ margin: 0, padding: 0 }}>
                <span style={{
                    fontSize: '1.9rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.06em',
                }}>
                    Express.
                </span>
            </NavbarBrand>
            {!nologin &&
                <div style={{ position: 'absolute', right: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {user?.email && <span className="d-none d-md-inline" style={{ fontSize: '1.0rem', color: 'rgba(255,255,255,0.7)' }}>{user.email}</span>}
                    <LoginButton user={user} jwt={jwt} />
                </div>}
        </Navbar>
    );
}