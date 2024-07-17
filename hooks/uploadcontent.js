/* hooks/uploadcontent.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

const getFormDataSize = (formData) => 
  [...formData].reduce((size, [name, value]) => size + (typeof value === 'string' ? value.length : value.size), 0);

export default async function uploadContent({myFormData, channelID, contentID, title, description, ext_url, lat, long, published, setProgress, jwt}) 
{ 
  let url = getBaseURL() + "/api/uploadContentToChannel";

  if (!jwt)
  {
    url = getBaseURL() + "/api/uploadSubmission";
    if (!channelID)
      channelID = "rx7dzpg";
  }

  // TODO: Dont need content?
  if (!channelID /*|| (!myFormData && !ext_url)*/)
  {
    setErrorText("No channel provided");
    return null;
  }

  if (!myFormData)
    myFormData = new FormData();

  if (getFormDataSize(myFormData) > 8e6)
  {
    setErrorText("File size too big: Maximum is 10MB");
    return null;
  }
    
  myFormData.append("uniqueID", channelID);
  if (contentID)
    myFormData.append("contentID", contentID);

  if (lat && long)
  {
      myFormData.append('lat', lat);
      myFormData.append('long', long);
  }

  if (title)
    myFormData.append("title", title);

  if (description)
    myFormData.append("description", description);

  if (ext_url)
    myFormData.append("ext_url", ext_url);

  //if (published)
  myFormData.append("published", "true");

  try {
    return await axios.post(url, myFormData, 
      {
        headers: jwt ? { 'Authorization': 'Bearer ' + jwt} : {},
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: setProgress ? (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(progress);
        } : {},
      },
    );
  } 
  catch (err) {
    setError(err);
    return null;
  }
} 
