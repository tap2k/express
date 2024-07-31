import getBaseURL from "../hooks/getbaseurl";

export default function getMediaURL() 
{
  return process.env.NEXT_PUBLIC_CLOUD_STORAGE ? "" : getBaseURL();
}     
