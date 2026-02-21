import { destroyCookie } from 'nookies';

export default function handler(req, res) {
  // Only allow POST requests
  //if (req.method !== 'POST') {
  //  return res.status(405).json({ message: 'Method not allowed' });
  //}

  // Destroy the JWT cookie
  destroyCookie({ res }, 'jwt', {
    path: '/',
  });

  // Send a success response
  res.status(200).json({ message: 'Logged out successfully' });
}