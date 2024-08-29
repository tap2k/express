import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function deleteChannel(privateID) 
{
  if (!privateID)
  {
    setErrorText("Error no channel provided");
    return null;
  }  
  const url = getBaseURL() + "/api/deleteSubmissionChannel";
  try {
    return await axios.post(url, { privateID: privateID });
  } catch (err) {
    setError(err);
    return null;
  }
}
