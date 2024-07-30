/* pages/index.js */

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, Navbar, NavbarBrand } from 'reactstrap';
import ChannelAdder from '../components/channeladder';
import addChannel from "../hooks/addchannel";
import { RecorderWrapper } from '@/components/recorderstyles';

export default () => {  
    const [channelId, setChannelId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (router.query.channelid) {
            setChannelId(router.query.channelid);
        }
    }, [router.query]);

    const handleAddChannel = async (formData) => {
        const channeldata = await addChannel(formData);
        console.log(channeldata);
        if (channeldata) {
            // Replace the current URL with the new channel ID
            router.replace(`/?channelid=${channeldata.uniqueID}`);
        } else {
            console.error("Failed to create channel");
        }
    };

    const containerStyle = {
        display: 'flex-start',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
    };

    const linkCardStyle = {
        width: '100%',
        marginBottom: '15px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    };

    const linkStyle = {
        display: 'block',
        padding: '20px',
        fontSize: '18px',
        color: '#007bff',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
        textAlign: 'center',
    };

    return (
        <RecorderWrapper>
            <Navbar color="secondary" style={{ display: 'flex', justifyContent: 'center', minHeight: '60px' }}>
                <Link href="/" passHref legacyBehavior>
                    <NavbarBrand style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 'large' }}>
                        <b style={{fontSize: 'x-large'}}>Maustro Express</b>
                    </NavbarBrand>
                </Link>
            </Navbar>
            <div style={containerStyle}>
                {channelId ? (
                <div style={{width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center'}}>
                    <p style={{fontSize: 'large', color: '#6c757d', marginBottom: '30px'}}>
                    You can manage or share your reel with others using the links below
                    </p>
                    <Card style={{...linkCardStyle, marginBottom: '20px'}}>
                        <CardBody style={{padding: '15px'}}>
                            <Link href={`/reel?channelid=${channelId}&admin=1`} style={{...linkStyle, color: '#28a745'}} rel="noopener noreferrer" target="_blank">
                            <strong style={{fontSize: 'large'}}>Manage</strong>
                            <p style={{margin: '5px 0 0', fontSize: 'small', color: '#6c757d'}}>Manage and edit your reel</p>
                            </Link>
                        </CardBody>
                    </Card>
                    <Card style={{...linkCardStyle, marginBottom: '20px'}}>
                        <CardBody style={{padding: '15px'}}>
                            <Link href={`/upload?channelid=${channelId}`} style={{...linkStyle, color: '#ff9800'}} rel="noopener noreferrer" target="_blank">
                            <strong style={{fontSize: 'large'}}>Upload</strong>
                            <p style={{margin: '5px 0 0', fontSize: 'small', color: '#6c757d'}}>Upload videos to your reel</p>
                            </Link>
                        </CardBody>
                    </Card>
                    <Card style={linkCardStyle}>
                        <CardBody style={{padding: '15px'}}>
                            <Link href={`/reel?channelid=${channelId}`} style={{...linkStyle, color: '#007bff'}} rel="noopener noreferrer" target="_blank">
                            <strong style={{fontSize: 'large'}}>Share</strong>
                            <p style={{margin: '5px 0 0', fontSize: 'small', color: '#6c757d'}}>View and share your reel with others</p>
                            </Link>
                        </CardBody>
                    </Card>
                </div>
                ) : (
                <ChannelAdder onSubmit={handleAddChannel} />
                )}
            </div>
        </RecorderWrapper>
    );
};
