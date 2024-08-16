import { Alert } from 'reactstrap';

export default function Banner({ title, subtitle }) {
  return (
    <Alert 
      style={{
        backgroundColor: 'rgba(41, 128, 185, 0.1)',
        marginBottom: '1rem',
        padding: '2rem 1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#1a5f7a', // Darker blue for better readability
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          {title}
        </h1>
        {subtitle && (
          <h3 style={{
            color: '#34495e', // Deep gray for subtitle
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
