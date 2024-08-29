import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function getChannel({channelID, privateID}) 
{
  if (!channelID && !privateID) {
    setErrorText("No channel provided");
    return null;
  }
  try {
    if (privateID)
    {
      let url = getBaseURL() + "/api/getSubmissionChannel";
      const resp = await axios.post(url, {privateID: privateID});
      return resp.data;
    }
    let url = getBaseURL() + "/api/getChannel?uniqueID=" + channelID;
    const resp = await axios.get(url);
    return resp.data;

  } catch (err) {
    setError(err);
    return null;
  }
} 