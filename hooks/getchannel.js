import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function getChannel({channelID, admin}) 
{
  if (!channelID) {
    setErrorText("No channel provided");
    return null;
  }
  try {
    let url = getBaseURL() + "/api/getChannel?uniqueID=" + channelID;
    if (admin)
      url = getBaseURL() + "/api/getSubmissionChannel?uniqueID=" + channelID;
    const resp = await axios.get(url);
    return resp.data;

  } catch (err) {
    setError(err);
    return null;
  }
} 