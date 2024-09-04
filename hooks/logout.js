/* hooks/logout.js */

import axios from 'axios';
import setError from "./seterror";

export default async function logout(router) 
{
  if (!router)
  {
    setErrorText("No router provided");
    return null;
  }
  try {
    await axios.post(router.basePath + '/api/logout', {}, {
      withCredentials: true
    });
    return true;
  } catch (err) {
    setError(err);
    return false;
  }
} 
