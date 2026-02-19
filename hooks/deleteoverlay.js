/* hooks/deleteoverlay.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

export default async function deleteOverlay({overlayID, jwt})
{
  const url = getBaseURL() + "/api/deleteOverlay";

  if (!overlayID || !jwt)
  {
    setErrorText("No channel or overlay provided or not logged in");
    return null;
  }

  try {
    return await axios.post(url, { overlayID: overlayID },
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