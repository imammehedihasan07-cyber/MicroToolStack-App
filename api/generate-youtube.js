export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  // Vercel Environment Variables থেকে GROQ_API_KEY নেওয়া হচ্ছে
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY environment variable is missing' });
  }

  try {
    const promptText = `Generate YouTube SEO metadata for topic: "${topic}" in strictly valid JSON format like this:
{
  "titles": ["1. Title 1", "2. Title 2", "3. Title 3", "4. Title 4", "5. Title 5"],
  "description": "Write a 150-word SEO video description here with target keywords.",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5"
}`;

    // Groq API Endpoint Direct Call
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert YouTube SEO generator. Always output raw JSON only, without any markdown codeblock formatting.'
          },
          {
            role: 'user',
            content: promptText
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: 'Groq API Error: ' + data.error.message });
    }

    let rawText = data.choices?.[0]?.message?.content || '';

    // Clean JSON string if enclosed in markdown blocks
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(rawText);
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('Groq API Error:', error);
    return res.status(500).json({ error: 'Server Error: ' + error.message });
  }
}
