import { Alert } from 'reactstrap';
import LoginButton from "../components/loginbutton";
import ChannelControls from "./channelcontrols";

export default function Banner({ channel, foregroundColor, privateID, jwt }) {
  if (!channel) return null;

  const makeStyle = {
    position: 'absolute',
    top: '0.1rem',
    right: '0px',
    zIndex: 1,
    padding: '0.25rem'
  };

  return (
    <>
      <LoginButton style={makeStyle} jwt={jwt} />
      <Alert style={{
        backgroundColor: 'transparent',
        padding: '1.5rem',
        border: 'none',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <div style={{
            position: 'relative',
            backgroundColor: foregroundColor ? foregroundColor : '#E6F0FF99',
            borderRadius: '10px',
            padding: '1.5rem 3rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
            minWidth: '300px'
          }}>
            <h1 style={{
              color: '#0a4f6a',
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}>
              {channel.name}
            </h1>
            {channel.description && (
              <h3 style={{
                color: '#24394e',
                fontSize: '1.25rem',
                fontWeight: 'normal'
              }}>
                {channel.description}
              </h3>
            )}
            {(privateID || jwt) && 
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 10,
              }}>
                <ChannelControls channel={channel} privateID={privateID} jwt={jwt} />
              </div>}
          </div>
        </div>
      </Alert>
    </>
  );
}