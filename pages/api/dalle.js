// pages/api/dalle.js

import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    if (!req.body.prompt)
        res.status(400).json({ error: 'Please provide a prompt to Dall-e.' });

    let model = req.body.model;
    if (!model)
        model = 'dall-e-3';
      
    const openai = new OpenAI();

    const dalleResponse = await openai.images.generate({
      prompt: req.body.prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json", // Request base64 format
      model: model
    });

    const imageBase64 = dalleResponse.data[0].b64_json;

    res.status(200).json({ imageBase64 });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}
