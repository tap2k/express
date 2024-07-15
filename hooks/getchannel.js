/* hooks/getchannel.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function getChannel({channelID}) 
{
  if (!channelID) {
    setErrorText("No channel provided");
    return null;
  }
  try {
    let url = getBaseURL() + "/api/getChannel?uniqueID=" + channelID;
    const resp = await axios.get(url);
    const channel = resp.data;
    return channel;

  } catch (err) {
    setError(err);
    return null;
  }
} 