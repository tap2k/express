/* hooks/updateoverlay.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError, {setErrorText} from "./seterror";

export default async function updateOverlay( {overlayID, tl_lat, tl_long, tr_lat, tr_long, br_lat, br_long, bl_lat, bl_long, jwt} )
{
  if (!overlayID || !jwt)
  {
    setErrorText("Error no overlay provided or login first");
    return null;
  }

  const url = getBaseURL() + "/api/updateOverlay";

  const myFormData = new FormData();
  myFormData.append("overlayID", overlayID);
  if (tl_lat != undefined)
    myFormData.append("tl_lat", tl_lat);
  if (tl_long != undefined)
    myFormData.append("tl_long", tl_long);
  if (tr_lat != undefined)
    myFormData.append("tr_lat", tr_lat);
  if (tr_long != undefined)
    myFormData.append("tr_long", tr_long);
  if (bl_lat != undefined)
    myFormData.append("bl_lat", bl_lat);
  if (bl_long != undefined)
    myFormData.append("bl_long", bl_long);
  if (br_lat != undefined)
    myFormData.append("br_lat", br_lat);
  if (br_long != undefined)
    myFormData.append("br_long", br_long);

  try {
    return await axios.post(url, myFormData,
    {
      headers: { 'Authorization': 'Bearer ' + jwt}
    });
  } catch (err) {
    setError(err);
    return null;
  }
}
