
import axios from 'axios';
import sendEmail from "../../hooks/sendemail";
import setError from "../../hooks/seterror";

async function processVideoAndSendEmail(channelid, email) {
    const baseUrl = process.env.VIDEO_SERVER_URL || 'https://video.mahabot.in';

    try {
        const url = `${baseUrl}/mvc_video?channelid=${channelid}`;        
        const resp = await axios.get(url, {timeout: 3600000});
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

export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['POST']);
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const { channelid, email } = req.body;

        if (!channelid || !email) {
            setError('Missing required parameters');
            return res.status(400).json({
                error: 'Missing required parameters',
                details: 'Both channelid and email are required'
            });
        }

        // Send immediate response
        res.status(202).json({ message: 'Request accepted, processing started' });

        // Continue processing in the background
        processVideoAndSendEmail(channelid, email).catch(error => {
            console.error('Background processing error:', error);
            setError(error);
        });
    } catch (error) {
        console.error('Handler error:', error);
        setError(error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
}
