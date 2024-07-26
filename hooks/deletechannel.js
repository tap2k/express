/* hooks/deletechannel.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function deleteChannel(channelID) 
{
  if (!channelID)
  {
    setErrorText("Error no channel provided");
    return null;
  }  
  const url = getBaseURL() + "/api/deleteSubmissionChannel";
  try {
    return await axios.post(url, { uniqueID: channelID });
  } catch (err) {
    setError(err);
    return null;
  }
}
