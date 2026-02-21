import axios from 'axios';
import setError from "./seterror";

export default async function createCheckout({ plan, interval, jwt }) {
  if (!jwt) {
    setError("Please login first");
    return null;
  }
  try {
    const res = await axios.post('/api/createCheckout', { plan, interval });
    return res.data;
  } catch (err) {
    setError(err);
    return null;
  }
}
