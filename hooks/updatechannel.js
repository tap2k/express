import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function updateChannel({ name, description, uniqueID, interval, showtitle, ispublic, picturefile, audiofile, email, deletePic, deleteAudio }) 
{    
  if (!uniqueID)
  {
    setErrorText("Error no channel provided");
    return null;
  }
  
  const url = getBaseURL() + "/api/updateSubmissionChannel";

  const formData = new FormData();
  formData.append("uniqueID", uniqueID);

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
    formData.append("name", name);
  if (description !== undefined) 
    formData.append("description", description);
  if (interval !== undefined) 
    formData.append("interval", interval);
  if (showtitle !== undefined) 
    formData.append("showtitle", showtitle);
  if (ispublic !== undefined) 
    formData.append("public", ispublic);
  if (pictureblob) 
    formData.append("picturefile", pictureblob, picturefile);
  if (audioblob) 
    formData.append("audiofile", audioblob, audiofile);
  if (email !== undefined) 
    formData.append("email", email);
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
