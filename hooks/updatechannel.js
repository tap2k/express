/* hooks/updatechannel.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function updateChannel( {myFormData, channelID, name, description, interval, deletePic} ) 
{    
  if (!channelID)
  {
    setErrorText("Error no channel provided");
    return null;
  }
  
  const url = getBaseURL() + "/api/updateSubmissionChannel";
  
  if (!myFormData)
    myFormData = new FormData();
  
  myFormData.append("uniqueID", channelID);
  if (name != undefined)
    myFormData.append("name", name);
  if (description != undefined)
    myFormData.append("description", description);
  if (deletePic != undefined)
    myFormData.append("deletepic", deletePic);
  if (interval != undefined)
    myFormData.append("interval", interval);
  
  try {
    return await axios.post(url, myFormData);
  } catch (err) {
    setError(err);
    return null;
  }
}
