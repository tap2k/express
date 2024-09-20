import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function deleteChannel({channelID, jwt}) 
{
  if (!channelID || !jwt)
  {
    setErrorText("Error no channel provided");
    return null;
  }

  try {
    
    const url = getBaseURL() + "/api/deleteChannel?uniqueID=" + channelID;
    return await axios.post(url, { uniqueID: channelID }, {headers: { 'Authorization': 'Bearer ' + jwt}});  

  } catch (err) {
    setError(err);
    return null;
  }
}
