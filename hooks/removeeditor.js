import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function removeEditor(channelID, email, jwt) {
  if (!channelID || !email || !jwt)
  {
    setErrorText("No channel or email provided or please login first");
    return null;
  }  
  const url = getBaseURL() + "/api/removeEditor";
  try {
    return await axios.post(url, { uniqueID: channelID, email: email }, { headers: { 'Authorization': 'Bearer ' + jwt} });
  } catch (err) {
    setError(err);
    return null;
  }
}
