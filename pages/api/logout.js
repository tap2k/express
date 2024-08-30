import { destroyCookie } from 'nookies';

export default function handler(req, res) {
  // Only allow POST requests
  //if (req.method !== 'POST') {
  //  return res.status(405).json({ message: 'Method not allowed' });
  //}

  // Destroy the JWT cookie
  destroyCookie({ res }, 'jwt', {
    path: '/', // must be the same path as set in login
  });

  // Send a success response
  res.status(200).json({ message: 'Logged out successfully' });
}