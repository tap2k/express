/* hooks/updatetag.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function updateTag( {myFormData, tagID, tag, markercolor, deletePic, jwt, privateID} ) 
{  

  if (!tagID || (!jwt && !privateID))
  {
    setErrorText("Error no tag provided");
    return null;
  }
      
  if (!myFormData)
    myFormData = new FormData();
  myFormData.append("tagID", tagID);
  if (tag != undefined)
    myFormData.append("tag", tag);
  if (markercolor != undefined)
    myFormData.append("markercolor", markercolor);
  if (deletePic != undefined)
    myFormData.append("deletepic", deletePic);
  
  let url = getBaseURL() + "/api/updateSubmissionTag";
  let headerclause = {};
  if (privateID != undefined)
    myFormData.append("privateID", privateID);
  else
  {
    url = getBaseURL() + "/api/updateTag";
    headerclause = {'Authorization': 'Bearer ' + jwt};
  }

  try {
    return await axios.post(url, myFormData,
    {
      headers: headerclause
    });
  } catch (err) {
    setError(err);
    return null;
  }
}