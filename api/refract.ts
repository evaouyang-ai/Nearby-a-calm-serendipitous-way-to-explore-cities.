// api/refract.ts — Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { getBaseInstruction } from '../lib/gemini-helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { step } = req.body;
  if (!step) return res.status(400).json({ error: 'step is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `${getBaseInstruction()}
Given an existing destination, suggest a nearby alternative in the same neighborhood.
Return ONLY valid JSON for a single step matching the same structure as the input.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Suggest an alternative to: ${JSON.stringify(step)}. Must be in the same area, currently open, and different in character.`,
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
    console.error('[refract] error:', err?.message || err);
    res.status(500).json({ error: err?.message || 'Something went wrong' });
  }
}
