import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import getBaseURL from "../../hooks/getbaseurl";
import setError from "../../hooks/seterror";
import { createPrivateID } from '../../hooks/seed';

const publicDir = path.join(process.cwd(), 'public');

export default async function handler(req, res) {

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
      }

    try {
        const { name, description, uniqueID, interval, showtitle, ispublic, picturefile, audiofile } = req.body;

        const url = getBaseURL() + "/api/createSubmissionChannel";
        const formData = new FormData();

        // Append text fields
        if (name !== undefined) formData.append("name", name);
        if (description !== undefined) formData.append("description", description);
        if (interval !== undefined) formData.append("interval", interval);
        if (showtitle !== undefined) formData.append("showtitle", showtitle);
        if (ispublic !== undefined) formData.append("public", ispublic);

        // Handle picture file
        if (picturefile && picturefile != "None") {
            const picturePath = path.join(publicDir, 'images', picturefile);
            if (fs.existsSync(picturePath)) {
                formData.append("picturefile", fs.createReadStream(picturePath), picturefile);
            } else {
                console.error(`Picture file not found: ${picturePath}`);
            }
        }

        // Handle audio file
        if (audiofile && picturefile != "None") {
            const audioPath = path.join(publicDir, 'audio', audiofile);
            if (fs.existsSync(audioPath)) {
                formData.append("audiofile", fs.createReadStream(audioPath), audiofile);
            } else {
                console.error(`Audio file not found: ${audioPath}`);
            }
        }

        const axiosResponse = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                'Content-Type': 'multipart/form-data'
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        const channelData = axiosResponse.data;

        if (channelData && channelData.uniqueID) {
            const privateID = createPrivateID(channelData.uniqueID);
            
            res.status(200).json({
                uniqueID: channelData.uniqueID,
                privateID: privateID,
                name: channelData.name
            });
        } else {
            res.status(500).json({ error: 'Failed to create channel' });
        }
    } catch (error) {
        setError(error);
        console.error('Error creating channel:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
