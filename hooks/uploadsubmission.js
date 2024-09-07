import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import getBaseURL from "./getbaseurl";
import setError, { setErrorText } from "./seterror";

const getFormDataSize = (formData) => 
  [...formData].reduce((size, [name, value]) => size + (typeof value === 'string' ? value.length : value.size), 0);

export default async function uploadSubmission({ myFormData, contentID, title, description, name, email, location, ext_url, lat, long, published, textAlignment, backgroundColor, setProgress, router, channelID, privateID, jwt }) 
{ 

  if (!channelID || !router)
  {
    setErrorText("No channel or router provided");
    return null;
  }

  if (!myFormData)
    myFormData = new FormData();

  /*if (getFormDataSize(myFormData) > 50e6)
  {
    setErrorText("File size too big: Maximum is 50MB");
    return null;
  }*/
    
  if (contentID)
    myFormData.append("contentID", contentID);

  if (lat && long)
  {
      myFormData.append('lat', lat);
      myFormData.append('long', long);
  }

  if (title)
    myFormData.append("title", title);
  if (description)
    myFormData.append("description", description);
  if (name)
    myFormData.append("name", name);
  if (email)
    myFormData.append("email", email);
  if (location)
    myFormData.append("location", location);
  if (ext_url)
    myFormData.append("ext_url", ext_url);
  // TODO: FIX THIS!
  //if (published)
  myFormData.append("published", "true");
  if (textAlignment)
    myFormData.append("textalignment", textAlignment);
  if (backgroundColor)
    myFormData.append("background_color", backgroundColor);

  let url = getBaseURL() + "/api/uploadSubmission";
  let headerclause = {};

  if (jwt)
  {
    myFormData.append("uniqueID", channelID)
    url = getBaseURL() + "/api/uploadContentToChannel";
    headerclause = {'Authorization': 'Bearer ' + jwt};
  }
  else
  {
    if (privateID)
      myFormData.append("privateID", privateID);
    else
      myFormData.append("uniqueID", channelID)
  }
  
  try {
    const response = await axios.post(url, myFormData, 
      {
        headers: headerclause,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: setProgress ? (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(progress);
        } : undefined,
      },
    );

    if (response.status === 200) {

      const buttons = [
        {
          label: 'OK',
          onClick: () => {
            router.replace(router.asPath, undefined, { scroll: false });
          }
        }
      ];
  
      // TODO: hacky
      if (router.asPath.includes('upload') && response.data?.[0]?.channel?.public) {
        buttons.push({
          label: 'Go to Reel',
          onClick: () => {
            const currentQuery = router.query;
            router.push({
              pathname: '/reel',
              query: currentQuery
            });
          }
        });
      }

      confirmAlert({
        title: 'Thanks for your submission!',
        message: 'Your file was uploaded successfully',
        buttons: buttons
      });
    }

    return response;
  } 
  catch (err) {
    setError(err);
    return null;
  }
}