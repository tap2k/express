import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function getChannel({channelID, privateID}) 
{
  if (!channelID) {
    setErrorText("No channel provided");
    return null;
  }
  try {
    let url = getBaseURL() + "/api/getChannel?uniqueID=" + channelID;
    if (privateID)
      url = getBaseURL() + "/api/getSubmissionChannel?uniqueID=" + channelID;
    const resp = await axios.get(url);
    console.log(resp.data);
    return resp.data;

  } catch (err) {
    setError(err);
    return null;
  }
} 