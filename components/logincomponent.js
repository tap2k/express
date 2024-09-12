import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import { RecorderWrapper, StyledInput } from './recorderstyles';
import { Button } from 'reactstrap';
import axios from 'axios';
import getBaseURL from "../hooks/getbaseurl";
import setError from "../hooks/seterror";

export default function LoginComponent({ loginPath }) {
  const router = useRouter();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef();
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async () => {
    if (!usernameRef.current?.value || !passwordRef.current?.value) {
      alert("Please fill out both fields");
      return;
    }
    setUpdating(true);
    const params = { 
      identifier: usernameRef.current.value, 
      password: passwordRef.current.value 
    };
    try {
      await axios.post(router.basePath + '/api/login', params);
      if (loginPath)
        router.push(router.basePath + loginPath);
      else
        router.push('/');
    } catch (err) {
      setError(err);
    } finally {
      setUpdating(false);
    }
  };

  const forgotPassword = async () => {
    if (!emailRef.current?.value) {
      alert("Please enter your email address");
      return;
    }
    setUpdating(true);
    const params = { email: emailRef.current.value };
    try {
      await axios.post(router.basePath + '/api/auth/local/forgot-password', params);
      alert("Please check your email for a reset link");
      setForgotPasswordMode(false);
    } catch (err) {
      setError(err);
    } finally {
      setUpdating(false);
    }
  };

  const buttonStyle = {
    fontSize: 'large',
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#5dade2', 
    border: 'none',
    color: '#ffffff',
    fontWeight: 'bold',
  };

  return (
    <RecorderWrapper>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '10px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#2c3e50',
          textAlign: 'center',
          marginBottom: '15px',
          fontWeight: '600',
          letterSpacing: '1px',
          paddingBottom: '10px',
          fontFamily: 'Arial, sans-serif'
        }}>
          Login
        </h1>
        {!forgotPasswordMode ? (
          <>
            <StyledInput
              type="text"
              innerRef={usernameRef}
              placeholder="Enter your username or email"
            />
            <StyledInput
              type="password"
              innerRef={passwordRef}
              placeholder="Enter your password"
            />
          </>
        ) : (
          <StyledInput
            type="email"
            innerRef={emailRef}
            placeholder="Enter your email for password reset"
          />
        )}
        
        <Button
          onClick={forgotPasswordMode ? forgotPassword : handleSubmit}
          style={buttonStyle}
          disabled={updating}
        >
          {forgotPasswordMode ? 'Reset Password' : 'Login'}
        </Button>
        {/* <Button
          onClick={() => setForgotPasswordMode(!forgotPasswordMode)}
          style={{...buttonStyle, marginTop: '5px'}}
        >
          {forgotPasswordMode ? 'Back to Login' : 'Forgot Password'}
        </Button> */}
        {!forgotPasswordMode && <a href={getBaseURL() + "/api/connect/google"} >
          <Button style={{...buttonStyle, marginTop: '5px'}} disabled={updating}>
            Sign in with Google
          </Button>
        </a>}
        {/* <p style={{ marginTop: '25px', textAlign: 'center' }}>
          Don't have an account? <Link href="/register">Register here</Link>
        </p> */}
      </div>
      </RecorderWrapper>
  );
}