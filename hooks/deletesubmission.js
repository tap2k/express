import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function deleteSubmission({contentID, privateID}) 
{
  if (!contentID || !privateID)
  {
    setErrorText("Error no content provided");
    return null;
  }    
  const url = getBaseURL() + "/api/deleteSubmission";
  try {
    return await axios.post(url, { id: contentID, privateID: privateID });
  } catch (err) {
    setError(err);
    return null;
  }
}
