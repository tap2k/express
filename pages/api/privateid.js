import { createPrivateID } from '../../hooks/seed';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { channelid } = req.query;
    if (!channelid) {
      return res.status(400).json({ error: 'channelid query parameter is required' });
    }
    const privateID = createPrivateID(channelid);

    const hostname = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const adminLink = `${protocol}://${hostname}/editor?channelid=${privateID}`;
    res.send(adminLink);
  
    } catch (error) {
    console.error('Error generating private ID:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
