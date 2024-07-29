/* hooks/addchannel.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError from "./seterror";

export default async function addChannel({name, description, uniqueID, interval, showtitle, ispublic, picturefile, audiofile}) 
{
  const url = getBaseURL() + "/api/createSubmissionChannel";
  var params = {};
  if (name != undefined)
    params["name"] = name;
  if (description != undefined)
    params["description"] = description;
  if (uniqueID != undefined)
    params["uniqueID"] = uniqueID;
  if (interval != undefined)
    params["interval"] = interval;
  if (showtitle != undefined)
    params["showtitle"] = showtitle;
  if (ispublic!= undefined)
    params["public"] = ispublic;
  if (picturefile != undefined)
    params["picturefile"] = picturefile;
  if (audiofile != undefined)
    params["audiofile"] = audiofile;
  try {
    const res = await axios.post(url, params);
    return res.data;
  } catch (err) {
    setError(err);
    console.error(err);
    return null;
  }
}