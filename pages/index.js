import { useState } from 'react';
import Link from 'next/link';
import { Card, CardBody } from 'reactstrap';
import nookies from 'nookies';
import addChannel from '../hooks/addchannel';
import updateChannel from "../hooks/updatechannel";
import sendEmailLinks from '../hooks/sendemaillinks';
import BannerTwo from '../components/bannertwo';
import { RecorderWrapper } from '../components/recorderstyles';
import ChannelEditor from '../components/channeleditor';
import EmailModal from '../components/emailmodal'; 

export default function Home( ) {
    const [channelID, setChannelID] = useState(null);
    const [privateID, setPrivateID] = useState(null);
    const [channelName, setChannelName] = useState(null);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const handleAddChannel = async (data) => {
        try {
            const respdata = await addChannel(data);
            setChannelName(respdata.name);
            setPrivateID(respdata.privateID);
            setChannelID(respdata.uniqueID);
            toggleEmailModal();
        } catch (error) {
            console.error("Error creating channel:", error);
        }
    };

    const handleEmailSubmit = async (email) => {
        if (email) {
            try {
                await updateChannel({privateID: privateID, email: email});
                await sendEmailLinks({channelID: channelID, privateID: privateID, channelName: channelName, email: email});
                alert('Email sent successfully!');
            } catch (error) {
                console.error("Failed to send email:", error);
                alert('Failed to send email. Please try again.');
            }
        }
        toggleEmailModal();
    };

    const toggleEmailModal = () => {
        setIsEmailModalOpen(!isEmailModalOpen);
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
        <>
            <RecorderWrapper>
                <BannerTwo />
                <div style={containerStyle}>
                    {channelID ? (
                        <div style={{width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center'}}>
                            <p style={{fontSize: 'large', color: '#6c757d', marginBottom: '40px'}}>
                                Your new reel <strong>{channelName}</strong> has been created. You can manage or share your reel using the links below
                            </p>
                            {privateID && (
                                <Card style={{...linkCardStyle, marginBottom: '20px'}}>
                                    <CardBody style={{padding: '15px'}}>
                                        <Link href={`/editor?channelid=${privateID}`} style={{...linkStyle, color: '#28a745'}} rel="noopener noreferrer" target="_blank">
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
                                        <strong style={{fontSize: 'x-large'}}>Reel</strong>
                                        <p style={{margin: '5px 0 0', fontSize: 'medium', color: '#6c757d'}}>View and share your reel</p>
                                    </Link>
                                </CardBody>
                            </Card>
                        </div>
                    ) : (
                        <ChannelEditor onSubmit={handleAddChannel} />
                    )}
                </div>
            </RecorderWrapper>
            <EmailModal 
                isOpen={isEmailModalOpen} 
                toggle={toggleEmailModal}
                onSubmit={handleEmailSubmit}
                headerText="Send Email"
                bodyText="Your channel has been created successfully. Please enter your email address below to receive links to manage and view your reel."
            />
        </>
    );
}

export const getServerSideProps = async (ctx) => {
    const cookies = nookies.get(ctx);
    if (cookies?.jwt) 
      return {
        redirect: { permanent: false, destination: '/myreels' }
      }
    return { props: {} };
  }
