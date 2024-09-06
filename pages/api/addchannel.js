import addChannel from "../../hooks/addchannel";

export default async function dalle(req, res) {

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log(req.body);

  try {
    if (!req.body.name)
    {
        res.status(400).json({ error: 'Please provide a channel name.' });
        return;
    }

    const channeldata = await addChannel({name: req.body.name});
    res.status(200).json(channeldata);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}