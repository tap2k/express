import { useState, useRef } from "react";
import { Input, Button, Card, CardBody } from "reactstrap";
import Link from 'next/link';
import addChannel from "../hooks/addchannel";

export default function ChannelAdder() {
  const titleRef = useRef();
  const subtitleRef = useRef();
  const [channelId, setChannelId] = useState(null);
  const [channelName, setChannelName] = useState(null);

  const handleAddChannel = async () => {
    const titleValue = titleRef.current.value;
    const subtitleValue = subtitleRef.current.value;
    if (titleValue) {
      const channeldata = await addChannel({name: titleValue, description: subtitleValue});        
      const uniqueID = channeldata["uniqueID"];
      setChannelId(uniqueID);
      setChannelName(titleValue);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  };

  const inputStyle = {
    fontSize: '18px',
    width: '100%',
    height: '50px',
    marginBottom: '15px',
    borderRadius: '12px',
    border: '1px solid #ccc',
    padding: '0 15px',
  };

  const buttonStyle = {
    fontSize: '18px',
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const linkCardStyle = {
    width: '100%',
    marginBottom: '15px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
    <div style={containerStyle}>
      {channelId ? (
        <div style={{width: '100%'}}>
          <h2 style={{textAlign: 'center', marginBottom: 40}}>Your new reel '{channelName}' has been created</h2>
          <Card style={linkCardStyle}>
            <CardBody style={{padding: 0}}>
              <Link href={`/reel?channelid=${channelId}&admin=1`} style={linkStyle} rel="noopener noreferrer" target="_blank">
                <strong>Admin</strong> - Manage your reel
              </Link>
            </CardBody>
          </Card>
          { /* <Card style={linkCardStyle}>
            <CardBody style={{padding: 0}}>
              <Link href={`/upload?channelid=${channelId}`} style={linkStyle} rel="noopener noreferrer" target="_blank">
                <strong>Upload</strong> - Add content to your channel
              </Link>
            </CardBody>
          </Card> */ }
          <Card style={linkCardStyle}>
            <CardBody style={{padding: 0}}>
              <Link href={`/reel?channelid=${channelId}`} style={linkStyle} rel="noopener noreferrer" target="_blank">
                <strong>Reel</strong> - Share your reel
              </Link>
            </CardBody>
          </Card>
        </div>
      ) : (
        <>
          <Input
            type="text"
            innerRef={titleRef}
            placeholder="Enter your title here"
            style={inputStyle}
          />
          <Input
            type="text"
            innerRef={subtitleRef}
            placeholder="Enter your subtitle here"
            style={inputStyle}
          />
          <Button
            onClick={handleAddChannel}
            style={buttonStyle}
            color="primary" 
          >
            Make a New Reel
          </Button>
        </>
      )}
    </div>
  );
}
