import type { NextApiRequest, NextApiResponse } from 'next';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const API_KEY = 'AIzaSyAy8EQnDP5J4YPKQzXMLAf5Z7WYGqrZtTE';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    console.log('Sending request to Gemini API:', { text });

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: {
          text: `Analyze the sentiment of this text: "${text}"`,
        },
      }),
    });

    if (!response.ok) {
      console.error('Error from Gemini API:', response.status, response.statusText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    console.log(response)       
    const result = await response.json();
    console.log('Gemini API Response:', result);

    const isSad = result?.sentiment === 'negative'; // Adjust based on actual API response
    res.status(200).json({ sad: isSad });
  } catch (error) {
    console.error('Error processing sentiment:', error);
    res.status(500).json({ message: 'Error analyzing sentiment' });
  }
}
