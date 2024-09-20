/* hooks/deletetag.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function deleteTag( {tagID, jwt, privateID} ) 
{  

  if (!tagID)
  {
    setErrorText("Error no tag provided");
    return null;
  }
      
  const url = getBaseURL() + "/api/deleteTag";
  let headerclause = {};
  if (jwt)
    headerclause = {'Authorization': 'Bearer ' + jwt};
  
  try {
    return await axios.post(url, { tagID: tagID, privateID: privateID ? privateID : null },
    {
      headers: headerclause
    });
  } catch (err) {
    setError(err);
    return null;
  }
}
