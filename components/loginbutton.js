//import Link from 'next/link';
import { useRouter } from 'next/router';
import getBaseURL from "../hooks/getbaseurl";
import logout from "../hooks/logout";

const buttonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  color: '#fff',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  padding: '6px 18px',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'all 0.2s ease',
};

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
  const label = uxme ? "UX4ME" : jwt ? "Logout" : "Login";

  return (
    <div {...props}>
      <a
        href={link}
        onClick={(jwt && !uxme) ? handleLogoutClick : null}
        title={label}
        style={buttonStyle}
      >
        {label}
      </a>
    </div>
  );
}