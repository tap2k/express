import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function getUser(jwt) 
{
  if (!jwt)
  {
    setErrorText("Please login first");
    return null;
  }
  try {
    const user = await axios.get(getBaseURL() + '/api/users/me', {
      headers: {
        Authorization:
          `Bearer ${jwt}`,
        }
    });
    return user?.data;
  } catch (err) {
      setError(err);
      return null;
  }
}