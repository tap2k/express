import { useRouter } from 'next/router';
import axios from 'axios';
import { setCookie } from 'nookies';
import getBaseURL from "../../hooks/getbaseurl";

export default function GoogleCallback({ error, jwt }) {
  const router = useRouter();

  if (jwt) {
    setCookie(null, 'jwt', jwt, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    router.push('/myreels');
    return null;
  }

  if (error) {
    return (
      <div>
        <h2>Login Error</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/')}>Return to Home Page</button>
      </div>
    );
  }

  return null;
}

export async function getServerSideProps(context) {
  const { access_token } = context.query;

  if (!access_token) {
    return {
      props: { error: 'No access token provided.' }
    };
  }

  try {
    const url = getBaseURL() + "/api/auth/google/callback";
    const result = await axios.get(url, {
      params: { access_token }
    });

    if (result.data && result.data.jwt) {
      return {
        props: { jwt: result.data.jwt }
      };
    } else {
      return {
        props: { error: 'Authentication failed. Please try again.' }
      };
    }
  } catch (error) {
    console.error('Error during Google callback:', error);
    return {
      props: { error: `Server error: ${error.message}` }
    };
  }
}