import { Alert } from 'reactstrap';
import ChannelControls from "./channelcontrols";

export default function Banner({ channel, privateID }) {
  if (!channel) return null;

  return (
    <>
      <Alert style={{
        backgroundColor: 'transparent',
        padding: '1.5rem',
        border: 'none',
        zIndex: 90
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <div style={{
            backgroundColor: 'rgba(230, 240, 255, 0.6)',
            borderRadius: '10px',
            padding: '1.5rem 3rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
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
            {privateID && <ChannelControls channel={channel} privateID={privateID} />}
          </div>
        </div>
      </Alert>
    </>
  );
}