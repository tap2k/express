import { Alert } from 'reactstrap';

export default function Banner({ title, subtitle }) {
  return (
    <Alert 
      style={{
        backgroundColor: 'transparent',
        marginTop: '2.5rem',
        padding: '0rem',
        border: 'none'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(230, 240, 255, 0.8)', // Light blue background
          borderRadius: '10px',
          padding: '1.5rem 10rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(5px)',
        }}>
          <h1 style={{
            color: '#0a4f6a', // Darker blue for better readability
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            {title}
          </h1>
          {subtitle && (
            <h3 style={{
              color: '#24394e', // Deep gray for subtitle
              fontSize: '1.25rem',
              fontWeight: 'normal'
            }}>
              {subtitle}
            </h3>
          )}
        </div>
      </div>
    </Alert>
  );
}
