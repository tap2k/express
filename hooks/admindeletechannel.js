import axios from 'axios';
import getBaseURL from "./getbaseurl";

export default async function adminDeleteChannel({channelID, jwt})
{
  try {
    const url = getBaseURL() + "/api/deleteChannel?uniqueID=" + channelID;
    return await axios.post(url, { uniqueID: channelID }, {headers: { 'Authorization': 'Bearer ' + jwt}});
  } catch (err) {
    return null;
  }
}
