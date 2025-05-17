import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a travel planner AI that creates personalized itineraries.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-4',
    });

    res.status(200).json({ itinerary: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}
