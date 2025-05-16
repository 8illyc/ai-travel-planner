import supabase from '@/lib/supabase';

export default async function handler(req, res) {
  const { email, prompt, itinerary } = req.body;
  if (!email || !prompt || !itinerary) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const { error } = await supabase.from('itineraries').insert([{ email, prompt, itinerary }]);
  if (error) return res.status(500).json({ error: 'Failed to save itinerary' });

  res.status(200).json({ success: true });
}
