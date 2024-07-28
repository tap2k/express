import * as mime from 'mime-types';
import OpenAI from "openai";
import { toFile } from 'openai';

function trimMessages(messages, maxChars) {
    if (!maxChars)
        maxChars = 64000;

    let totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    let systemMessageIndex = messages.findIndex(m => m.role === 'system');

    while (totalChars > maxChars && messages.length > 1) {
        if (systemMessageIndex === 0) {
            // Skip the first message if it's the system message
            messages.splice(1, 1);
        } else {
            messages.shift();
            // Update systemMessageIndex if the first message is removed
            if (systemMessageIndex !== -1) {
                systemMessageIndex--;
            }
        }
        totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    }

    // If the system message exists and is not at the first position, move it to the start
    if (systemMessageIndex > 0) {
        let systemMessage = messages[systemMessageIndex];
        messages.splice(systemMessageIndex, 1); // Remove the system message from its current position
        messages.unshift(systemMessage); // Add the system message to the beginning
    }
}

export async function dalle(prompt, model)
{
  if (!model)
    model = 'dall-e-3';
  
  const openai = new OpenAI();
  
  const response = await openai.images.generate({
    model: model,
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });
  
  return response.data[0].url;
}

export async function whisper(base64string, mimetype)
{
    const audioBuffer = Buffer.from(base64string, "base64");
    var filename = Math.random().toString(36).substring(2, 15) + Math.random().toString(23).substring(2, 5);
    filename += "." + mime.extension(mimetype);
  
    const openai = new OpenAI();
    const transcription = await openai.audio.transcriptions.create({
        file: await toFile(audioBuffer, filename, {
          contentType: mimetype,
        }),
        model: "whisper-1",
    });
    
    return transcription.text;
}

export async function chatgpt(messages, model)
{
    if (!model)
        model = 'gpt-4-turbo';

    trimMessages(messages);
    const openai = new OpenAI();
    const chatCompletion = await openai.chat.completions.create({
        messages: messages,
        model: model,
    });

    console.log(chatCompletion.choices);
    return chatCompletion.choices[0].message.content;
}