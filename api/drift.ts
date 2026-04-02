// api/drift.ts — Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { getBaseInstruction, parseResponse } from '../lib/gemini-helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { lat, lng } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const ai = new GoogleGenAI({ apiKey });

  const locationContext = lat && lng
    ? `The user is at coordinates ${lat}, ${lng}.`
    : 'The user is somewhere in a city.';

  const systemInstruction = `${getBaseInstruction()}
Return ONLY valid JSON for a single step:
{
  "step": {
    "title": "A poetic name",
    "narrativeBridge": "A quiet observation.",
    "destination": {
      "name": "Concrete Searchable Name",
      "description": "Brief observation.",
      "location": "Neighborhood or street",
      "sensoryDetail": "A quiet sensory note."
    },
    "estimatedTime": "Nearby"
  }
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${locationContext} Suggest one interesting thing to drift toward right now. Verify it is open.`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace === -1) throw new Error('Invalid response');
    const parsed = JSON.parse(text.substring(firstBrace, lastBrace + 1));
    const citations = (response as any).candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    res.json({ step: parsed.step || parsed, citations });
  } catch (err: any) {
    console.error('[drift] error:', err?.message || err);
    res.status(500).json({ error: err?.message || 'Something went wrong' });
  }
}
