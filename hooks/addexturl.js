/* hooks/addexturl.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function addExtUrl({channelID, contentID, ext_url, jwt}) 
{
  let url = getBaseURL() + "/api/uploadContentToChannel";

  if (!jwt)
  {
    url = getBaseURL() + "/api/uploadSubmission";
    if (!channelID)
      channelID = "probe";
  }

  if (!channelID || !ext_url)
  {
    setErrorText("Error no channel or URL provided or not logged in");
    return null;
  }

  try {
    return await axios.post(url, 
      {
        uniqueID: channelID,
        contentID: contentID, 
        ext_url: ext_url
      },
      {
        headers: { 'Authorization': 'Bearer ' + jwt},
      });
  } catch (err) {
    setError(err);
    return null;
  } 
} 