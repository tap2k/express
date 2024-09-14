import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError from "./seterror";

export default async function getPublicChannels() 
{
  try {
    const url = getBaseURL() + "/api/getPublicChannels";
    const channels = await axios.get(url);
      return channels.data;
    } catch (err) {
      setError(err);
      return null;
    }
} 