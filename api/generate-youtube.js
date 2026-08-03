export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not set' });
  }

  try {
    const promptText = `Generate YouTube SEO metadata for topic: "${topic}".
Return ONLY a valid JSON object without markdown syntax or formatting:
{
  "titles": "1. Title 1\\n2. Title 2\\n3. Title 3\\n4. Title 4\\n5. Title 5",
  "description": "Write a 150-word SEO video description here with timestamps placeholder and key points...",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5"
}`;
    // Updated API Endpoint using gemini-2.0-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: 'Google API Error: ' + data.error.message });
    }

    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean markdown syntax if Gemini wraps response in ```json ... ```
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(rawText);
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Server Error: ' + error.message });
  }
}
