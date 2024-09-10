import OpenAI from "openai";

export default async function chatgpt(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    if (!req.body.prompt)
      return res.status(400).json({ error: 'Please provide a prompt for ChatGPT.' });

    let model = req.body.model;
    if (!model)
      model = 'gpt-4o'; // Using GPT-4 with vision capabilities

    const openai = new OpenAI();

    let messages = [{ role: "user", content: req.body.prompt }];

    // Check if an image URL is provided
    if (req.body.imageUrl) {
        console.log(req.body.imageUrl);
      messages = [
        {
          role: "user",
          content: [
            { type: "text", text: req.body.prompt },
            {
              type: "image_url",
              image_url: {
                  url: req.body.imageUrl
                  //url: 'https://mvc-dev.nyc3.digitaloceanspaces.com/small_PXL_20240703_225813747_66d1cd1aa5.jpg'
                }
            }
          ]
        }
      ];
    }

    const chatCompletion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      max_tokens: 300 // Adjust as needed
    });

    const responseText = chatCompletion.choices[0].message.content;

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}