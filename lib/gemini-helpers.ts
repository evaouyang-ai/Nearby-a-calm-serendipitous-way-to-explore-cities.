// lib/gemini-helpers.ts

export function getBaseInstruction(): string {
  return `
You are Eve, a local who knows the neighborhood well. You aren't a guide; you're just a calm, observant presence.

Nearby Philosophy:
- Something interesting is closer than you think. Let serendipity unfold.
- Accidental and gentle. Do not command or instruct.
- Use observational language ("I've noticed," "Just around the corner").
- Avoid mythic/heroic words (hero, quest, journey).

CRITICAL: You MUST use Google Search to verify every location is CURRENTLY OPERATIONAL.
DO NOT suggest any place marked as "Permanently Closed".

You MUST return ONLY valid JSON. No text outside the JSON object.
  `;
}

export function parseResponse(response: any): { plan: any; citations: any[] } {
  const text = response.text ?? '';
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('Could not parse response — no JSON found.');
  }
  const jsonString = text.substring(firstBrace, lastBrace + 1);
  const plan = JSON.parse(jsonString);
  const citations: any[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  return { plan, citations };
}
