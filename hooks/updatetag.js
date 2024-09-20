/* hooks/updatetag.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function updateTag( {myFormData, tagID, tag, markercolor, deletePic, jwt, privateID} ) 
{  

  if (!tagID)
  {
    setErrorText("Error no tag provided");
    return null;
  }
      
  const url = getBaseURL() + "/api/updateTag";
  let headerclause = {};
  if (jwt)
    headerclause = {'Authorization': 'Bearer ' + jwt};
  
  if (!myFormData)
    myFormData = new FormData();
  myFormData.append("tagID", tagID);
  if (tag != undefined)
    myFormData.append("tag", tag);
  if (markercolor != undefined)
    myFormData.append("markercolor", markercolor);
  if (deletePic != undefined)
    myFormData.append("deletepic", deletePic);
  if (privateID != undefined)
    myFormData.append("privateID", privateID);
  
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