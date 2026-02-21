import { useRouter } from 'next/router';
import { Spinner, Button } from 'reactstrap';
import axios from 'axios';
import nookies from 'nookies';
import getBaseURL from "../../hooks/getbaseurl";

export default function GoogleCallback({ error }) {
  const router = useRouter();

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#eee',
      }}>
        <h2 style={{
          fontSize: '2rem',
          color: '#e74c3c',
          textAlign: 'center',
          marginBottom: '30px',
          fontWeight: '600',
          fontFamily: 'Arial, sans-serif'
        }}>
          Login Error
        </h2>
        <p style={{
          fontSize: '1.5rem',
          color: '#34495e',
          textAlign: 'center',
          marginBottom: '40px',
          fontFamily: 'Arial, sans-serif'
        }}>
          {error}
        </p>
        <Button
          color="primary"
          onClick={() => router.push('/')}
          style={{
            fontSize: 'large',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}
          title="Return to home"
        >
          Return to Home Page
        </Button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      zIndex: 9999,
    }}>
      <Spinner color="dark" style={{ width: '3rem', height: '3rem' }} />
    </div>
  );
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
      nookies.set(context, 'jwt', result.data.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      return {
        redirect: { permanent: false, destination: '/' }
      };
    } else {
      return {
        props: { error: 'Authentication failed. Please try again.' }
      };
    }
  } catch (error) {
    console.error('Error during Google callback:', error.response?.data || error.message);
    return {
      props: { error: error.response?.data?.error?.message || "Could not log in to Google" }
    };
  }
}
