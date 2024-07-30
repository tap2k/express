/* hooks/addchannel.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError from "./seterror";

export default async function addChannel({name, description, channelID, interval, showtitle, ispublic, picturefile, audiofile}) 
{
  const url = getBaseURL() + "/api/createSubmissionChannel";
  const formData = new FormData();

  if (name != undefined)
    formData.append("name", name);
  if (description != undefined)
    formData.append("description", description);
  if (channelID != undefined)
    formData.append("uniqueID", channelID);
  if (interval != undefined)
    formData.append("interval", interval);
  if (showtitle != undefined)
    formData.append("showtitle", showtitle);
  if (ispublic != undefined)
    formData.append("public", ispublic);
  if (picturefile != undefined)
    formData.append("picturefile", picturefile);
  if (audiofile != undefined)
    formData.append("audiofile", audiofile);

  try {
    const res = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (err) {
    setError(err);
    console.error(err);
    return null;
  }
}
