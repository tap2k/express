//import Link from 'next/link';
import { useRouter } from 'next/router';
import getBaseURL from "../hooks/getbaseurl";
import logout from "../hooks/logout";
import { MenuButton } from './recorderstyles';

export default function LoginButton({ user, jwt, ...props }) {

  let uxme = false;
  // TODO: This is hacky
  if (user?.provider === "supabase")
    uxme = true;

  const router = useRouter();

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    const success = await logout(router);
    if (success) {
      router.push('/');
    }
  };

  let link = uxme ? "http://dev.ux4.me/admin" : jwt ? "#" : getBaseURL() + "/api/connect/google";

  return (
    <div {...props}>
      {/*<Link href="/login">*/}
      <a href={link} >
        <MenuButton
          onClick={(jwt && !uxme) ? handleLogoutClick : null}
        >
          {uxme ? "UX4ME" : jwt ? "Logout"
            : "Login"
          }
        </MenuButton> 
      </a>
      {/*</Link>*/}
    </div>
  );
}