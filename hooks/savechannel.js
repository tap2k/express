import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError from "./seterror";

export default async function saveChannel({channel}) {
  if (!channel || !channel.contents?.length) 
    return;

  const url = getBaseURL() + "/api/saveSubmissionChannel";

  const payload = {
    id: channel.id,
    uniqueID: channel.uniqueID,
    contents: channel.contents.map(item => ({
      id: item.id,
      start_time: item.start_time,
      duration: item.duration
    }))
  };

  try {
    return await axios.post(url, payload);
  } catch (err) {
    setError(err);
    return null;
  }
}