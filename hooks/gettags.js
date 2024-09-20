/* hooks/gettags.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function getTags(channelID) 
{
  if (!channelID)
  {
    setErrorText("No tag provided");
    return null;
  }
  try {
    const url = getBaseURL() + "/api/getTags?uniqueID=" + channelID;
    //const tags = await axios.get(url, { headers: { 'Authorization': 'Bearer ' + jwt} });
    const tags = await axios.get(url);
    return tags.data;
  } catch (err) {
    setError(err);
    return null;
  }
} 