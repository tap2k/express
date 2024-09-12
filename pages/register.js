import RegisterComponent from '../components/registercomponent';

export default () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div style={{ width: '350px' }}>
        <RegisterComponent />
      </div>
    </div>
  );
}