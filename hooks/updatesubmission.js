import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function updateSubmission( {myFormData, contentID, order, title, description, name, email, location, lat, long, ext_url, published, deleteAudio, textAlignment, backgroundColor, setProgress, privateID, jwt} ) 
{ 
  console.log("jwt = " + jwt);
   
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
  if (name)
    myFormData.append("name", name);
  if (email)
    myFormData.append("email", email);
  if (location)
    myFormData.append("location", location);
  if (lat)
    myFormData.append("lat", lat);
  if (long)
    myFormData.append("long", long);
  if (ext_url != undefined)
    myFormData.append("ext_url", ext_url);
  if (published != undefined)
    myFormData.append("published", published);
  if (deleteAudio)
      myFormData.append("deleteaudio", deleteAudio);
  if (textAlignment)
    myFormData.append("textalignment", textAlignment);
  if (backgroundColor)
    myFormData.append("background_color", backgroundColor);
  
  let url = getBaseURL() + "/api/updateSubmission";
  let headerclause = {};
  if (privateID)
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
      } : {},
    });
  } catch (err) {
    setError(err);
    return null;
  }
}
