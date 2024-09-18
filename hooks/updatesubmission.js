import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function updateSubmission({ myFormData, contentID, order, title, description, name, email, location, lat, long, ext_url, published, deleteMedia, deleteAudio, textAlignment, backgroundColor, foregroundColor, setProgress, privateID, jwt }) 
{    
  if (!contentID || (!privateID && !jwt))
  {
    setErrorText("Error no content provided");
    return null;
  }
  
  if (!myFormData)
    myFormData = new FormData();

  myFormData.append("contentID", contentID);

  if (order != undefined)
    myFormData.append("order", order);
  if (title != undefined)
    myFormData.append("title", title);
  if (description != undefined)
    myFormData.append("description", description);
  if (name != undefined)
    myFormData.append("name", name);
  if (email != undefined)
    myFormData.append("email", email);
  if (location != undefined)
    myFormData.append("location", location);
  if (lat != undefined)
    myFormData.append("lat", lat);
  if (long != undefined)
    myFormData.append("long", long);
  if (ext_url != undefined)
    myFormData.append("ext_url", ext_url);
  if (published != undefined)
    myFormData.append("published", published);
  if (deleteMedia != undefined)
    myFormData.append("deletemedia", deleteMedia);
  if (deleteAudio != undefined)
      myFormData.append("deleteaudio", deleteAudio);
  if (textAlignment != undefined)
    myFormData.append("textalignment", textAlignment);
  if (backgroundColor != undefined)
    myFormData.append("background_color", backgroundColor);
  if (foregroundColor != undefined)
    myFormData.append("foreground_color", foregroundColor);
  
  let url = getBaseURL() + "/api/updateSubmission";
  let headerclause = {};
  if (privateID != undefined)
    myFormData.append("privateID", privateID);
  else
  {
    url = getBaseURL() + "/api/updateContent";
    headerclause = {'Authorization': 'Bearer ' + jwt};
  }

  try {
    return await axios.post(url, myFormData, {
      headers: headerclause,
      onUploadProgress: setProgress ? (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        setProgress(progress);
      } : undefined,
    });
  } catch (err) {
    setError(err);
    return null;
  }
}
