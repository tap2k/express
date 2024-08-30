import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function getMyChannels(jwt) 
{
  if (!jwt) {
    setErrorText("Please login first");
    return null;
  }
  try {
    const url = getBaseURL() + "/api/getMyChannels";
    const channels = await axios.get(url, {
        headers: {
          Authorization:
            `Bearer ${jwt}`,
          }
    });
      return channels.data;
    } catch (err) {
      setError(err);
      return null;
    }
} 