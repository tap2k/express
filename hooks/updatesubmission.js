import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function updateSubmission( {myFormData, contentID, order, description, published, ext_url, deletePic, textAlignment} ) 
{  
  if (!contentID)
  {
    setErrorText("Error no content provided");
    return null;
  }
  const url = getBaseURL() + "/api/updateSubmission";
  
  if (!myFormData)
    myFormData = new FormData();

  myFormData.append("contentID", contentID);
  if (order != undefined)
    myFormData.append("order", order);
  if (description != undefined)
    myFormData.append("description", description);
  if (ext_url != undefined)
    myFormData.append("ext_url", ext_url);
  if (published != undefined)
    myFormData.append("published", published);
  if (deletePic)
      myFormData.append("deletepic", deletePic);
  if (textAlignment)
    myFormData.append("textalignment", textAlignment);
      
  try {
    return await axios.post(url, myFormData);
  } catch (err) {
    setError(err);
    return null;
  }
}
