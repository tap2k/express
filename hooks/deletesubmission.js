import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function deleteSubmission({contentID, privateID, jwt}) 
{
  if (!contentID || (!privateID && !jwt))
  {
    setErrorText("Error no content provided");
    return null;
  }    
  
  try {
    
    if (privateID)
    {
      const url = getBaseURL() + "/api/deleteSubmission";
      return await axios.post(url, { id: contentID, privateID: privateID });
    }

    const url = getBaseURL() + "/api/deleteContent";
    return await axios.post(url, { id: contentID }, {headers: { 'Authorization': 'Bearer ' + jwt}});
  
  } catch (err) {
    setError(err);
    return null;
  }
}
