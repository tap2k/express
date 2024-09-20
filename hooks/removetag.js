/* hooks/removetag.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function removeTag({ contentID, tagID, jwt, privateID } ) 
{  
  if (!contentID || !tagID || (!privateID && !jwt))
  {
    setErrorText("Error no content provided");
    return null;
  }

  let url = getBaseURL() + "/api/removeSubmissionTag";
  let headerclause = {};
  if (!privateID)
  {
    url = getBaseURL() + "/api/removeTag";
    headerclause = {'Authorization': 'Bearer ' + jwt};
  }

  try {
    const resp = await axios.post(url, { contentID: contentID, tagID: tagID, privateID: privateID ? privateID : null },
      {
        headers: headerclause
      }
    );
    return resp.data;
  } catch (err) {
    setError(err);
    return null;
  }
}
