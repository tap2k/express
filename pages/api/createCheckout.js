import Stripe from 'stripe';
import axios from 'axios';
import { parseCookies } from 'nookies';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const priceMap = {
  starter: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
    annual: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID,
  },
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  },
};

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

  const { plan, interval } = req.body;

  if (!plan || !interval)
    return res.status(400).json({ error: 'Missing plan or interval.' });

  const priceId = priceMap[plan]?.[interval];
  if (!priceId)
    return res.status(400).json({ error: 'Invalid plan or interval.' });

  const mvcurl = process.env.NEXT_PUBLIC_STRAPI_HOST || 'http://localhost:1337';

  try {
    const [userRes, planRes] = await Promise.all([
      axios.get(`${mvcurl}/api/users/me`, {
        headers: { Authorization: `Bearer ${cookies.jwt}` },
      }),
      axios.get(`${mvcurl}/api/getUserPlan`, {
        headers: { Authorization: `Bearer ${cookies.jwt}` },
      }),
    ]);
    const user = userRes.data;

    let customerId = planRes.data?.stripeCustomerId;

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { strapiUserId: String(user.id) },
      });
      customerId = customer.id;

      await axios.put(`${mvcurl}/api/updateUserPlan`, {
        userId: user.id,
        stripeCustomerId: customerId,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: baseUrl,
      cancel_url: baseUrl,
      metadata: { strapiUserId: String(user.id), plan, interval },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: 'Failed to create checkout session.' });
  }
}
