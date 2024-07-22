/* hooks/addchannel.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError from "./seterror";

export default async function addChannel({name, description, uniqueID, interval}) 
{
  const url = getBaseURL() + "/api/createChannel";
  var params = {};
  if (name != undefined)
    params["name"] = name;
  if (description != undefined)
    params["description"] = description;
  if (uniqueID != undefined)
    params["uniqueID"] = uniqueID;
  if (interval != undefined)
    params["interval"] = interval;
  try {
    const res = await axios.post(url, params);
    return res.data;
  } catch (err) {
    setError(err);
    return null;
  }
}
