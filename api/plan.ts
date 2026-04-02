import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, area, lat, lng } = req.body ?? {};
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  let locationContext = area?.trim()
    ? `Focus on: "${area}".`
    : lat && lng
    ? `User is near ${lat}, ${lng}.`
    : 'User is in a vibrant city.';

  const systemInstruction = `You are Eve, a calm local observer. Suggest 3-4 interesting places matching the user's interest.
Avoid permanently closed places.
Return ONLY valid JSON, no extra text:
{
  "introduction": "A quiet opening note.",
  "steps": [
    {
      "title": "Poetic name",
      "narrativeBridge": "Quiet observation on the way.",
      "destination": {
        "name": "Exact searchable place name",
        "description": "Brief observation.",
        "location": "Neighborhood or address",
        "sensoryDetail": "A quiet sensory note."
      },
      "estimatedTime": "Nearby"
    }
  ],
  "conclusion": "A quiet closing thought."
}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${locationContext} User wants: ${prompt}`,
      config: { systemInstruction },
    });

    const text = response.text ?? '';
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace === -1) throw new Error('No JSON in response');
    const plan = JSON.parse(text.substring(firstBrace, lastBrace + 1));
    return res.status(200).json({ plan, citations: [] });
  } catch (err: any) {
    console.error('[plan]', err?.message);
    return res.status(500).json({ error: err?.message ?? 'Something went wrong' });
  }
}
