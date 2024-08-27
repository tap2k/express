import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function updateChannel({ myFormData, name, description, uniqueID, interval, showtitle, ispublic, picturefile, audiofile, backgroundColor, email, deletePic, deleteAudio, setProgress }) 
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
  if (pictureblob) 
    myFormData.append("picturefile", pictureblob, picturefile);
  if (audioblob) 
    myFormData.append("audiofile", audioblob, audiofile);
  if (backgroundColor) 
    myFormData.append("background_color", backgroundColor);
  if (email !== undefined) 
    myFormData.append("email", email);
  if (deletePic !== undefined) 
    myFormData.append("deletepic", deletePic);
  if (deleteAudio !== undefined) 
    myFormData.append("deleteaudio", deleteAudio);

  try {
    return await axios.post(url, myFormData,
      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: setProgress ? (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(progress);
        } : {},
      },
    );
  } catch (err) {
    setError(err);
    return null;
  }
}
