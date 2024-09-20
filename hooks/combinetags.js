/* hooks/combinetags.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function combineTags({channelID, tagsourceID, tagdestID, jwt, privateID}) 
{
  if (!tagsourceID || !tagdestID)
  {
    setErrorText("No tags provided");
    return null;
  }
  const url = getBaseURL() + "/api/combineTags";
  let headerclause = {};
  if (jwt)
    headerclause = {'Authorization': 'Bearer ' + jwt};

  try {
    return await axios.post(url, { uniqueID: channelID ? channelID : null, privateID: privateID ? privateID : null, tagsourceID: tagsourceID, tagdestID: tagdestID },    
    {
      headers: headerclause
    });
  } catch (err) {
    setError(err);
    return null;
  }
}
