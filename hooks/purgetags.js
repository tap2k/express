/* hooks/purgetags.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function purgeTags({ channelID, jwt, privateID }) 
{
  if (!channelID)
  {
    setErrorText("No channel provided");
    return null;
  }

  const url = getBaseURL() + "/api/purgeTags";
  let headerclause = {};
  if (jwt)
    headerclause = {'Authorization': 'Bearer ' + jwt};

  try {
    return await axios.post(url, { uniqueID: channelID ? channelID : null, privateID: privateID ? privateID : null }, 
      {
        headers: headerclause
    });
  } catch (err) {
    setError(err);
    return null;
  }
}
