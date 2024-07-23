import { useRef } from "react";
import { Input, Button } from "reactstrap";
import { useRouter } from "next/router";
import addChannel from "../hooks/addchannel";

export default function ChannelAdder() {
  const inputRef = useRef();
  const router = useRouter();

  const handleAddChannel = async () => {
    const inputValue = inputRef.current.value;
    if (inputValue) {
      const channeldata = await addChannel({name: inputValue});        
      const uniqueID = channeldata["uniqueID"];
      router.push(`/upload?channelid=${uniqueID}`);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '20px',
  };

  const inputStyle = {
    fontSize: 'large',
    width: '300px',
    height: '50px',
    marginBottom: '15px',
    borderRadius: '12px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    fontSize: 'x-large',
    width: '300px',
    padding: '5px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };
  
  return (
    <div style={containerStyle}>
      <Input
        type="text"
        innerRef={inputRef}
        placeholder="Enter your prompt here"
        style={inputStyle}
      />
      <Button
        onClick={handleAddChannel}
        style={buttonStyle}
        color="primary" 
      >
        Make a New Reel
      </Button>
    </div>
  );
}
