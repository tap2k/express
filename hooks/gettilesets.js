/* hooks/gettilesets.js */

import axios from 'axios';
import getBaseURL from "./getbaseurl";
import setError from "./seterror";

export default async function getTilesets() 
{
  try {
    const url = getBaseURL() + "/api/getTilesets";
    const tilesets = await axios.get(url);
    return tilesets.data;
  }
  catch (err) {
    setError(err);
    return null;
  }
} 