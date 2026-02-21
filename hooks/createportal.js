import axios from 'axios';
import setError from "./seterror";

export default async function createPortal({ jwt }) {
  if (!jwt) {
    setError("Please login first");
    return null;
  }
  try {
    const res = await axios.post('/api/createPortal', {});
    return res.data;
  } catch (err) {
    setError(err);
    return null;
  }
}
