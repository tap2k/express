/* hooks/addchannel.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError from "./seterror";

export default async function addChannel({name, description, uniqueID, interval, showTitle, participantsView, picturefile, audiofile}) 
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
  if (showTitle != undefined)
    params["showtitle"] = showTitle;
  if (participantsView != undefined)
    params["public"] = participantsView;
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