import axios from 'axios';
import getBaseURL from "./getbaseurl";

export default async function getAdminData(jwt)
{
  try {
    const url = getBaseURL() + "/api/getAdminData";
    const res = await axios.get(url, {headers: { 'Authorization': 'Bearer ' + jwt}});
    return res.data;
  } catch (err) {
    return null;
  }
}
