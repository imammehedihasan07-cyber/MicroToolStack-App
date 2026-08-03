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
    const promptText = `You are a YouTube SEO Expert. Generate YouTube metadata for the topic: "${topic}".
Provide the output strictly in valid JSON format (without Markdown backticks) with the following exact keys:
1. "titles": Provide 5 catchy, high-CTR YouTube video titles (numbered 1 to 5).
2. "description": Write an engaging, SEO-rich YouTube description (around 150-200 words) with call-to-actions, timestamps placeholders, and main key takeaways.
3. "hashtags": Provide 10 to 15 relevant viral hashtags separated by spaces (e.g. #YouTube #Topic).

Return ONLY the JSON string. Do not wrap in \`\`\`json.`;

    // Direct REST API Call (Gemini 2.5 Flash / 1.5 Flash Support)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptText }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    let textResponse = data.candidates[0].content.parts[0].text.trim();

    // Clean JSON markdown blocks if model returns them
    if (textResponse.startsWith('```json')) {
      textResponse = textResponse.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (textResponse.startsWith('```')) {
      textResponse = textResponse.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(textResponse);
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate YouTube content. ' + error.message });
  }
}