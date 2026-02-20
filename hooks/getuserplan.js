import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError from "./seterror";

export default async function getUserPlan(jwt)
{
  if (!jwt)
    return null;
  try {
    const res = await axios.get(getBaseURL() + '/api/getUserPlan', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    });
    return res?.data;
  } catch (err) {
    setError(err);
    return null;
  }
}
