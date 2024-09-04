import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function getChannel({channelID, privateID, jwt, edit}) 
{
  if (!channelID && !privateID) {
    setErrorText("No channel provided");
    return null;
  }
  try {
    if (privateID && edit)
    {
      const url = getBaseURL() + "/api/getSubmissionChannel?privateID=" + privateID;
      const resp = await axios.get(url);
      return resp.data;
    }

    if (jwt && edit)
    {
      const url = getBaseURL() + "/api/getMyChannel?uniqueID=" + channelID;
      const resp = await axios.get(url, {headers: { 'Authorization': 'Bearer ' + jwt}});
      return resp.data;
    }

    const url = getBaseURL() + "/api/getChannel?uniqueID=" + channelID;
    const resp = await axios.get(url);
    return resp.data;

  } catch (err) {
    setError(err);
    return null;
  }
} 