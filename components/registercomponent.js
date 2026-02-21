import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react'
import { Button } from "reactstrap";
import axios from 'axios';
import getBaseURL from "../hooks/getbaseurl";
import setError from "../hooks/seterror";
import { FcGoogle } from 'react-icons/fc';
import { RecorderWrapper, StyledInput } from './recorderstyles';

export default function RegisterComponent({...props}) 
{
  const router = useRouter();
  const [registered, setRegistered] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    if (!formProps.username || !formProps.password || !formProps.email)
    {
      alert("Please fill out all fields");
      return;
    }
    setUpdating(true);
    var params = { username: formProps.username, email: formProps.email, password: formProps.password}
    try {
      await axios.post(router.basePath + '/api/register', params);
      setRegistered(true);
    } catch (err) {
      setError(err);
    } finally {
      setUpdating(false);
    }
  }

  const buttonStyle = {
    fontSize: 'large',
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#1a5f7a',
    border: 'none',
    color: '#ffffff',
    fontWeight: 'bold',
  };

  return (
    <RecorderWrapper>
      <div {...props} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        padding: '10px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#1a5f7a',
          textAlign: 'center',
          marginBottom: '15px',
          fontWeight: '600',
          letterSpacing: '1px',
          paddingBottom: '10px',
        }}>
          Register
        </h1>

        { !registered ? 
          <form onSubmit={handleSubmit}>
            <StyledInput
              id="username"
              name="username"
              placeholder="Enter your username"
            />
            <StyledInput
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
            />
            <StyledInput
              id="password"
              name="password"
              placeholder="Enter your password"
              type="password"
            />
            <Button
              type="submit"
              style={buttonStyle}
              disabled={updating}
              title="Register"
            >
              Register
            </Button>

            <a href={getBaseURL() + "/api/connect/google"} style={{ textDecoration: 'none' }}>
              <Button
                style={{...buttonStyle, backgroundColor: '#fff', color: '#444', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                disabled={updating}
                title="Register with Google"
              >
                <FcGoogle size={20} /> Register with Google
              </Button>
            </a>
            <p style={{ marginTop: '25px', textAlign: 'center' }}>
              Already have an account? <Link href="/login">Login here</Link>
            </p>
          </form> 
          : 
          <span style={{
            margin: 10, 
            textAlign: 'center', 
            fontSize: '1.1rem', 
            color: '#2ecc71'
          }}>
            Thank you for registering! Please check your email for a confirmation code.
          </span> 
        }
      </div>
    </RecorderWrapper>
  )
}