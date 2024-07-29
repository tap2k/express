/* hooks/updatechannel.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function updateChannel( {myFormData, channelID, name, description, interval, showtitle, ispublic, picturefile, audiofile, deletePic, deleteAudio } ) 
{    
  if (!channelID)
  {
    setErrorText("Error no channel provided");
    return null;
  }
  
  const url = getBaseURL() + "/api/updateSubmissionChannel";
  
  if (!myFormData) {
    myFormData = new FormData();
  }
  
  myFormData.append("uniqueID", channelID);
  
  if (name !== undefined) 
    myFormData.append("name", name);
  if (description !== undefined) 
    myFormData.append("description", description);
  if (interval !== undefined) 
    myFormData.append("interval", interval);
  if (showtitle !== undefined) 
    myFormData.append("showtitle", showtitle);
  if (ispublic !== undefined) 
    myFormData.append("public", ispublic);
  if (picturefile !== undefined) 
    myFormData.append("picturefile", picturefile);
  if (audiofile !== undefined) 
    myFormData.append("audiofile", audiofile);
  if (deletePic !== undefined) 
    myFormData.append("deletepic", deletePic);
  if (deleteAudio !== undefined) 
    myFormData.append("deleteaudio", deleteAudio);

  try {
    return await axios.post(url, myFormData);
  } catch (err) {
    setError(err);
    return null;
  }
}
