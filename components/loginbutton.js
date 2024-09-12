//import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'reactstrap';
import getBaseURL from "../hooks/getbaseurl";
import logout from "../hooks/logout";
//import { MenuButton } from './recorderstyles';

export default function LoginButton({ jwt, ...props }) {
  const router = useRouter();

  const buttonStyle = {
    backgroundColor: 'rgba(92, 131, 156, 0.6)',
    color: 'rgba(240, 240, 240, 1)',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: 'calc(0.5vmin + 0.8em)',
    padding: '6px 10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.05)',
    margin: '0 2px',
    fontWeight: 600,
  };

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    const success = await logout(router);
    if (success) {
      router.push('/');
    }
  };

  return (
    <div {...props}>
      {/*<Link href="/login">*/}
      <a href={jwt ? "#" : getBaseURL() + "/api/connect/google"} >
        <Button style={buttonStyle}
          onClick={jwt ? handleLogoutClick : null}
        >
          {jwt ? "Logout"
            : "Login"
          }
        </Button> 
      </a>
      {/*</Link>*/}
    </div>
  );
}