import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a YouTube SEO Expert. Generate YouTube metadata for the topic: "${topic}".
Provide the output strictly in valid JSON format (without Markdown backticks) with the following exact keys:
1. "titles": Provide 5 catchy, high-CTR YouTube video titles (numbered 1 to 5).
2. "description": Write an engaging, SEO-rich YouTube description (around 150-200 words) with call-to-actions, timestamps placeholders, and main key takeaways.
3. "hashtags": Provide 10 to 15 relevant viral hashtags separated by spaces (e.g. #YouTube #Topic).

Return ONLY the JSON string. Do not wrap in \`\`\`json.`;

    const result = await model.generateContent(prompt);
    let textResponse = result.response.text().trim();

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