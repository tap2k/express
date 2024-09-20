/* hooks/deletetag.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function deleteTag( {tagID, jwt} ) 
{  

  if (!tagID || !jwt)
  {
    setErrorText("Error no tag provided");
    return null;
  }
      
  const url = getBaseURL() + "/api/deleteTag";
  const headerclause = {'Authorization': 'Bearer ' + jwt};
  
  try {
    return await axios.post(url, { tagID: tagID },
    {
      headers: headerclause
    });
  } catch (err) {
    setError(err);
    return null;
  }
}
