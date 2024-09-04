import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { setCookie } from 'nookies';
import getBaseURL from "../../hooks/getbaseurl";

export default function GoogleCallback() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    async function handleCallback() {
      const { access_token } = router.query;

      if (access_token) {
        try {
          const url = getBaseURL() + "/api/auth/google/callback";
          const result = await axios.get(url, {
            params: { 
              access_token: access_token
            }
          });

          if (result.data && result.data.jwt) {
            // Set the JWT in a cookie
            setCookie(null, 'jwt', result.data.jwt, {
              maxAge: 30 * 24 * 60 * 60, // 30 days
              path: '/',
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });

            // Redirect to dashboard or home page
            router.push('/myreels');
          } else {
            setError('Authentication failed. Please try again.');
          }
        } catch (error) {
            console.error('Error during Google callback:', error);
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              setError(`Server error: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
              // The request was made but no response was received
              setError('No response received from the server. Please try again.');
            } else {
              // Something happened in setting up the request that triggered an Error
              setError(`Error: ${error.message}`);
            }
        } finally {
          setIsProcessing(false);
        }
      } else {
        setError('No access token provided.');
        setIsProcessing(false);
      }
    }

    handleCallback();
  }, [router]);

  if (isProcessing) {
    return <div>Processing login...</div>;
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