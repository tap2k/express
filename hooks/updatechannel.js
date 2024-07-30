/* hooks/updatechannel.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function updateChannel( {name, description, channelID, interval, showtitle, ispublic, picturefile, audiofile, deletePic, deleteAudio } ) 
{    
  if (!channelID)
  {
    setErrorText("Error no channel provided");
    return null;
  }
  
  const url = getBaseURL() + "/api/updateSubmissionChannel";
  
  const formData = new FormData();
  formData.append("uniqueID", channelID);
  
  if (name !== undefined) 
    formData.append("name", name);
  if (description !== undefined) 
    formData.append("description", description);
  if (interval !== undefined) 
    formData.append("interval", interval);
  if (showtitle !== undefined) 
    formData.append("showtitle", showtitle);
  if (ispublic !== undefined) 
    formData.append("public", ispublic);
  if (picturefile !== undefined) 
    formData.append("picturefile", picturefile);
  if (audiofile !== undefined) 
    formData.append("audiofile", audiofile);
  if (deletePic !== undefined) 
    formData.append("deletepic", deletePic);
  if (deleteAudio !== undefined) 
    formData.append("deleteaudio", deleteAudio);

  try {
    return await axios.post(url, formData);
  } catch (err) {
    setError(err);
    return null;
  }
}
