import { useRouter } from 'next/router';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import getBaseURL from "../hooks/getbaseurl";
import logout from "../hooks/logout";

const buttonStyle = {
  color: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  padding: '8px',
  borderRadius: '50%',
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
  const Icon = jwt ? FaSignOutAlt : FaSignInAlt;

  return (
    <div {...props}>
      <a
        href={link}
        onClick={(jwt && !uxme) ? handleLogoutClick : null}
        title={label}
        style={buttonStyle}
      >
        <Icon size={20} />
      </a>
    </div>
  );
}