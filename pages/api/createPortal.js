import Stripe from 'stripe';
import axios from 'axios';
import { parseCookies } from 'nookies';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY)
    return res.status(503).json({ error: 'Billing is not configured.' });

  const cookies = parseCookies({ req });
  if (!cookies.jwt)
    return res.status(401).json({ error: 'Authentication required.' });

  const mvcurl = process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337';

  try {
    const planRes = await axios.get(`${mvcurl}/api/getUserPlan`, {
      headers: { Authorization: `Bearer ${cookies.jwt}` },
    });
    const stripeCustomerId = planRes.data?.stripeCustomerId;

    if (!stripeCustomerId)
      return res.status(400).json({ error: 'No billing account found. Please subscribe to a plan first.' });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: baseUrl,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Portal error:', err);
    return res.status(500).json({ error: 'Failed to open billing portal.' });
  }
}
