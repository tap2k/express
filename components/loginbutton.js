//import Link from 'next/link';
import { useRouter } from 'next/router';
import getBaseURL from "../hooks/getbaseurl";
import logout from "../hooks/logout";
import { MenuButton } from './recorderstyles';

export default function LoginButton({ jwt, ...props }) {
  const router = useRouter();

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
        <MenuButton
          onClick={jwt ? handleLogoutClick : null}
        >
          {jwt ? "Logout"
            : "Login"
          }
        </MenuButton> 
      </a>
      {/*</Link>*/}
    </div>
  );
}