import axios from 'axios';
//import sendEmail from "../../hooks/sendemail";
//import setError from "../../hooks/seterror";

// Old approach: background processing with email send from this server
/*
async function processVideoAndSendEmail(channelid, email, mvcurl) {
    const baseUrl = process.env.VIDEO_SERVER_URL || 'https://video.mahabot.in';

    try {
        const url = `${baseUrl}/mvc_video`;
        const resp = await axios.post(url, {
            channelid: channelid,
            url: mvcurl,
            email: email
        }, {timeout: 3600000});

        const data = resp.data;
        const videourl = data["video_url"];

        const subject = "EXPRESS VIDEO";
        const recipient = email;
        const body = `Your video is ready. Please access it at ${videourl}`;
        await sendEmail(subject, body, recipient);

        console.log('Video processed and email sent successfully');
    } catch (error) {
        console.error('Error in background processing:', error);
        setError(error);
    }
}
*/

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { channelid, email } = req.body;

    if (!channelid || !email) {
        return res.status(400).json({
            error: 'Missing required parameters',
            details: 'Both channelid and email are required'
        });
    }

    const mvcurl = process.env.NEXT_PUBLIC_STRAPI_HOST || "http://localhost:1337";
    const baseUrl = process.env.VIDEO_SERVER_URL || 'https://video.mahabot.in';

    try {
        // Video server spawns a background thread and returns 202 immediately.
        // It handles emailing the user when the video is done.
        await axios.post(`${baseUrl}/mvc_video`, {
            channelid, url: mvcurl, email
        });
        res.status(202).json({ message: 'Request accepted, processing started' });
    } catch (error) {
        console.error('Error dispatching video job:', error);
        res.status(500).json({ error: 'Failed to start video generation' });
    }
}