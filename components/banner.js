import { Alert } from 'reactstrap';

export default function Banner({ title, subtitle }) {
  return (
    <Alert 
      style={{
        backgroundColor: 'transparent',
        marginBottom: '0rem',
        padding: '2rem 0.5rem',
        border: 'none'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
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
    </Alert>
  );
}
