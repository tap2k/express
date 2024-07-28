/* hooks/deletecontent.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function deleteSubmission({contentID}) 
{
  if (!contentID)
  {
    setErrorText("Error no content provided");
    return null;
  }    
  const url = getBaseURL() + "/api/deleteSubmission";
  try {
    return await axios.post(url, { id: contentID });
  } catch (err) {
    setError(err);
    return null;
  }
}
