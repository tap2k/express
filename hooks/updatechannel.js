import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function updateChannel({ myFormData, name, description, interval, showtitle, ispublic, allowsubmissions, picturefile, audiofile, backgroundColor, email, tileset, deletePic, deleteAudio, setProgress, channelID, privateID, jwt }) 
{    
  if (!privateID && (!channelID || !jwt))
  {
    setErrorText("Error no channel provided");
    return null;
  }
  
  if (!myFormData)
    myFormData = new FormData();
  
  let audioblob = null;
  let pictureblob = null;
  if (audiofile)
  {    
    if (audiofile == "None")
      deleteAudio = true;
    else
    {
      const response = await fetch(`audio/${audiofile}`);
      audioblob = await response.blob();
    }
  }
  if (picturefile)
  {
    if (picturefile == "None")
      deletePic = true;
    else
    {
      if (picturefile.startsWith('data:image/png;base64,')) {
        // This is a DALL-E generated image
        const response = await fetch(picturefile);
        pictureblob = await response.blob();
        picturefile = 'dalle-image.png';
      }
      else
      {
        const response = await fetch(`images/${picturefile}`);
        pictureblob = await response.blob();
      }
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
  if (allowsubmissions !== undefined) 
    myFormData.append("allowsubmissions", allowsubmissions);
  if (pictureblob) 
    myFormData.append("picturefile", pictureblob, picturefile);
  if (audioblob) 
    myFormData.append("audiofile", audioblob, audiofile);
  if (backgroundColor != undefined) 
    myFormData.append("background_color", backgroundColor);
  if (email !== undefined) 
    myFormData.append("email", email);
  if (tileset !== undefined) 
    myFormData.append("tileset", tileset);
  if (deletePic !== undefined) 
    myFormData.append("deletepic", deletePic);
  if (deleteAudio !== undefined) 
    myFormData.append("deleteaudio", deleteAudio);

  let url = getBaseURL() + "/api/updateSubmissionChannel";
  let headerclause = {};

  if (privateID)
    myFormData.append("privateID", privateID);
  else
  {
    url = getBaseURL() + "/api/updateChannel";
    myFormData.append("uniqueID", channelID)
    headerclause = {'Authorization': 'Bearer ' + jwt};
  }

  try {
    return await axios.post(url, myFormData,
      {
        headers: headerclause,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: setProgress ? (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(progress);
        } : undefined,
      },
    );
  } catch (err) {
      setError(err);
      return null;
  }
}
