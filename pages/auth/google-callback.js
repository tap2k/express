import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Spinner, Button } from 'reactstrap';
import axios from 'axios';
import { setCookie } from 'nookies';
import getBaseURL from "../../hooks/getbaseurl";

export default function GoogleCallback({ error, jwt }) {
  const router = useRouter();

  useEffect(() => {
    if (jwt) {
      setCookie(null, 'jwt', jwt, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      router.push('/');
    }
  }, [jwt, router]);

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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      height: '100vh',
      backgroundColor: '#f8f9fa',
    }}>
      <h2 style={{
        fontSize: '1.8rem',
        color: '#34495e',
        textAlign: 'center',
        marginBottom: '20px',
        fontWeight: '500',
        fontFamily: 'Arial, sans-serif'
      }}>
        Processing Login
      </h2>
      <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      <p style={{
        fontSize: '1rem',
        color: '#7f8c8d',
        textAlign: 'center',
        marginTop: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        Please wait while we log you in...
      </p>
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
      return {
        props: { jwt: result.data.jwt }
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
