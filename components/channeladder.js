import { useRef } from "react";
import { Input } from "reactstrap";
import { useRouter } from "next/router";
import { StyledButton } from '../components/recorderstyles';
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

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '200px',
      }}>
        <Input
          type="text"
          innerRef={inputRef}
          placeholder="Enter channel name"
          style={{ marginBottom: '10px', width: '100%' }}
        />
        <StyledButton
          color="primary"
          onClick={handleAddChannel}
          style={{ width: '100%' }}
        >
          Make a New Reel
        </StyledButton>
      </div>
    </div>
  );
}