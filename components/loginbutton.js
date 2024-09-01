import { useRouter } from 'next/router';
import { Button } from 'reactstrap';
import getBaseURL from "../hooks/getbaseurl";
import logout from "../hooks/logout";

export default function LoginButton({ jwt, ...props }) {
  const router = useRouter();

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    const success = await logout(router);
    if (success) {
      // Redirect or update state as needed
      router.push('/');
    }
  };

  return (
    <div {...props}>
      <a href={jwt ? "#" : getBaseURL() + "/api/connect/google"} >
        <Button
          color="light"
          outline
          size="sm"
          style={{
            borderRadius: '20px',
            padding: '12px 18px',
            fontSize: 'large',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            backgroundColor: 'rgba(92, 131, 156, 0.6)',
            color: 'white',
            border: 'none',
            lineHeight: '1'
          }}
          onClick={jwt ? handleLogoutClick : null}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1A5F7A';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            e.target.style.color = '#1A5F7A';
          }}
        >
          {jwt ? "Logout"
            : "Login"
          }
        </Button> 
      </a>
    </div>
  );
}