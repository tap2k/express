/* hooks/uploadoverlay.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function addOverlay({myFormData, channelID, jwt})
{
  const url = getBaseURL() + "/api/uploadOverlay";

  if (!channelID || !myFormData || !jwt)
  {
    setErrorText("No channel or overlay provided or not logged in");
    return null;
  }

  myFormData.append("uniqueID", channelID);

  try {
    return await axios.post(url, myFormData,
      {
        headers: { 'Authorization': 'Bearer ' + jwt},
      },
    );
  }
  catch (err) {
    setError(err);
    return null;
  }
}