import LoginComponent from '../components/logincomponent';

export default function LoginPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div style={{ width: '350px' }}>
        <LoginComponent loginPath="/" />
      </div>
    </div>
  );
}