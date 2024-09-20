/* hooks/addtag.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function addTag({ contentID, tag, jwt, privateID }) 
{
  if (!contentID)
  {
    setErrorText("Error no content provided");
    return null;
  }

  const url = getBaseURL() + "/api/addTag";
  let headerclause = {};
  if (jwt)
    headerclause = {'Authorization': 'Bearer ' + jwt};


  try {
    const resp = await axios.post(url, { contentID: contentID, tag: tag, privateID : privateID ? privatedID : null },
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
