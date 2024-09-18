import axios from 'axios';
import getBaseURL from "../hooks/getbaseurl";
import setError from "./seterror";

export default async function addChannel({ name, description, email, showtitle, ispublic, allowsubmissions, interval, picturefile, audiofile, setProgress, jwt }) 
{   
    // TODO: Without logging in? 
    //let url = getBaseURL() + "/api/createSubmissionChannel";

    if (!jwt)
    {
        setError("Please login first");
        return null;
    }

    const url = getBaseURL() + "/api/createChannel";
    const myFormData = new FormData();

    let audioblob = null;
    let pictureblob = null;
    if (audiofile)
    {    
        const response = await fetch(`audio/${audiofile}`);
        audioblob = await response.blob();
    }
    if (picturefile)
    {
        if (picturefile.startsWith('data:image/png;base64,')) {
          // This is a DALL-E generated image
          const response = await fetch(picturefile);
          pictureblob = await response.blob();
          picturefile = 'dalle-image.png';
        }
        else
        {
          const response = await fetch(`images/${picturefile}`);
          pictureblob = await response.blob();
        }
    }

    if (name !== undefined) 
        myFormData.append("name", name);
    if (email !== undefined) 
        myFormData.append("email", email);
    if (description !== undefined) 
        myFormData.append("description", description);
    if (interval !== undefined) 
        myFormData.append("interval", interval);
    if (showtitle !== undefined) 
        myFormData.append("showtitle", showtitle);
    if (ispublic !== undefined) 
        myFormData.append("ispublic", ispublic);
    if (allowsubmissions !== undefined) 
        myFormData.append("allowsubmissions", allowsubmissions);
    if (pictureblob) 
        myFormData.append("picturefile", pictureblob, picturefile);
    if (audioblob) 
        myFormData.append("audiofile", audioblob, audiofile);
    
    let headerclause = {};
    if (jwt)
        headerclause = { 'Authorization': 'Bearer ' + jwt};
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
    return response.data;
    } catch (err) {
        setError(err);
        return null;
    }
}