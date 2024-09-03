import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError from "./seterror";

export default async function saveChannel({channel, privateID, jwt}) {

  if (!channel || !channel.contents?.length || (!privateID && !jwt))
  {
    setErrorText("Error no content provided");
    return null;
  }

  const payload = {
    uniqueID: channel.uniqueID,
    contents: channel.contents.map(item => ({
      id: item.id,
      start_time: item.start_time,
      duration: item.duration
    }))
  };

  try {
    
    if (privateID)
    {
      const url = getBaseURL() + "/api/saveSubmissionChannel";
      payload["privateID"] = privateID;
      return await axios.post(url, payload);
    }

    const url = getBaseURL() + "/api/saveChannel";
    return await axios.post(url, payload, {headers: { 'Authorization': 'Bearer ' + jwt}});

  } catch (err) {
    setError(err);
    return null;
  }
}