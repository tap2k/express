import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function updateChannel({ myFormData, name, description, uniqueID, interval, showtitle, ispublic, picturefile, audiofile, email, deletePic, deleteAudio }) 
{    
  if (!uniqueID)
  {
    setErrorText("Error no channel provided");
    return null;
  }
  
  const url = getBaseURL() + "/api/updateSubmissionChannel";

  if (!myFormData)
    myFormData = new FormData();
  
  myFormData.append("uniqueID", uniqueID);

  let audioblob = null;
  let pictureblob = null;
  if (audiofile)
  {
    if (audiofile == "None")
      deleteAudio = "true";
    else
    {
      const response = await fetch(`audio/${audiofile}`);
      audioblob = await response.blob();
    }
  }
  if (picturefile)
  {
    if (picturefile == "None")
      deletePic = "true";
    else
    {
      const response = await fetch(`images/${picturefile}`);
      pictureblob = await response.blob();
    }
  }
  
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
  if (pictureblob) 
    myFormData.append("picturefile", pictureblob, picturefile);
  if (audioblob) 
    myFormData.append("audiofile", audioblob, audiofile);
  if (email !== undefined) 
    myFormData.append("email", email);
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
