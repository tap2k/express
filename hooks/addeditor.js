import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function addEditor({channelID, email, jwt}) 
{
  if (!channelID || !email || !jwt)
  {
    setErrorText("Error no channel or email provided or not logged in");
    return null;
  }
  const url = getBaseURL() + "/api/addEditor";
  try {
    return await axios.post(url, { uniqueID: channelID, email: email }, { headers: { 'Authorization': 'Bearer ' + jwt} });
  } catch (err) {
    setError(err);
    return null;
  }
}
