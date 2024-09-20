/* hooks/addtag.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function addTag({ contentID, tag, jwt, privateID }) 
{
  if (!contentID || (!privateID && !jwt))
  {
    setErrorText("Error no content provided");
    return null;
  }

  let url = getBaseURL() + "/api/addSubmissionTag";
  let headerclause = {};
  if (!privateID)
  {
    url = getBaseURL() + "/api/addTag";
    headerclause = {'Authorization': 'Bearer ' + jwt};
  }

  try {
    const resp = await axios.post(url, { contentID: contentID, tag: tag, privateID : privateID ? privateID : null },
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
