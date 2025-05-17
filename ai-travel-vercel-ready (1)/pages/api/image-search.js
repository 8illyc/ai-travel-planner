export default async function handler(req, res) {
  const { query } = req.body;

  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${process.env.UNSPLASH_ACCESS_KEY}&per_page=4`);
    const data = await response.json();
    const urls = data.results.map(photo => photo.urls.regular);
    res.status(200).json({ urls });
  } catch (error) {
    res.status(500).json({ error: 'Image search failed' });
  }
}
