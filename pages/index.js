import { useState, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Input, Card, CardBody, Navbar, NavbarBrand } from 'reactstrap';
import ChannelAdder from '../components/channeladder';
import { RecorderWrapper } from '../components/recorderstyles';
import updateChannel from "../hooks/updatechannel";
import sendEmailLinks from '../hooks/sendemaillinks';

export default function Home() {
    const [channelID, setChannelID] = useState(null);
    const [privateID, setPrivateID] = useState(null);
    const [channelName, setChannelName] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const emailInputRef = useRef(null);

    const handleAddChannel = async (data) => {
        try {
            // TODO: Hacky
            const cleanedData = Object.keys(data).reduce((acc, key) => {
                if (data[key] !== null && data[key] !== undefined && data[key] !== 'None') {
                    if (typeof data[key] === 'boolean') {
                        acc[key] = data[key] ? "true" : "false"; // Convert booleans to "true" or "false"
                    } else if (data[key] instanceof File) {
                        // For File objects, we'll just send the file name
                        acc[key] = data[key].name;
                    } else {
                        acc[key] = String(data[key]); // Convert everything else to string
                    }
                }
                return acc;
            }, {});
    
            const response = await axios.post('/api/addchannel', cleanedData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const respdata = response.data;
    
            setChannelName(respdata.name);
            setPrivateID(respdata.privateID);
            setChannelID(respdata.uniqueID);
            toggleModal();
        } catch (error) {
            console.error("Error creating channel:", error);
        }
    };
    


    const handleEmailSubmit = async () => {
        if (emailInputRef.current?.value) {
            try {
                await updateChannel({uniqueID: channelID, email: emailInputRef.current?.value});
                await sendEmailLinks({channelID: channelID, privateID: privateID, channelName: channelName, email: emailInputRef.current?.value});
                alert('Email sent successfully!');
            } catch (error) {
                console.error("Failed to send email:", error);
                alert('Failed to send email. Please try again.');
            }
        }
        toggleModal();
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeBtn = (
        <button className="close" onClick={toggleModal}>
            &times;
        </button>
    );

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
        <>
            <RecorderWrapper>
                <Navbar style={{ backgroundColor: 'rgba(41, 128, 185, 0.4)', color: 'white', display: 'flex', justifyContent: 'center', minHeight: '60px' }}>
                    <NavbarBrand style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
                        <b style={{fontSize: 'xx-large'}}>EXPRESS</b>
                    </NavbarBrand>
                </Navbar>
                <div style={containerStyle}>
                    {channelID ? (
                        <div style={{width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center'}}>
                            <p style={{fontSize: 'large', color: '#6c757d', marginBottom: '40px'}}>
                                Your new reel <strong>{channelName}</strong> has been created. You can manage or share your reel using the links below
                            </p>
                            {privateID && (
                                <Card style={{...linkCardStyle, marginBottom: '20px'}}>
                                    <CardBody style={{padding: '15px'}}>
                                        <Link href={`/admin?channelid=${privateID}`} style={{...linkStyle, color: '#28a745'}} rel="noopener noreferrer" target="_blank">
                                            <strong style={{fontSize: 'x-large'}}>Manage</strong>
                                            <p style={{margin: '5px 0 0', fontSize: 'medium', color: '#6c757d'}}>Manage and edit your reel</p>
                                        </Link>
                                    </CardBody>
                                </Card>
                            )}
                            <Card style={{...linkCardStyle, marginBottom: '20px'}}>
                                <CardBody style={{padding: '15px'}}>
                                    <Link href={`/upload?channelid=${channelID}`} style={{...linkStyle, color: '#ff9800'}} rel="noopener noreferrer" target="_blank">
                                        <strong style={{fontSize: 'x-large'}}>Upload</strong>
                                        <p style={{margin: '5px 0 0', fontSize: 'medium', color: '#6c757d'}}>Upload videos to your reel</p>
                                    </Link>
                                </CardBody>
                            </Card>
                            <Card style={linkCardStyle}>
                                <CardBody style={{padding: '15px'}}>
                                    <Link href={`/reel?channelid=${channelID}`} style={{...linkStyle, color: '#007bff'}} rel="noopener noreferrer" target="_blank">
                                        <strong style={{fontSize: 'x-large'}}>Share</strong>
                                        <p style={{margin: '5px 0 0', fontSize: 'medium', color: '#6c757d'}}>View and share your reel</p>
                                    </Link>
                                </CardBody>
                            </Card>
                        </div>
                    ) : (
                        <ChannelAdder onSubmit={handleAddChannel} />
                    )}
                </div>
            </RecorderWrapper>
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal} close={closeBtn}>
                    Send Email
                </ModalHeader>
                <ModalBody>
                    <p>Your channel has been created successfully. Please enter your email address below to receive links to manage and view your reel.</p>
                    <Input 
                        type="email" 
                        placeholder="Enter your email address" 
                        innerRef={emailInputRef}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleEmailSubmit}>Send Email</Button>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
