// services/apiClient.ts
// Replaces GeminiService. Calls your own /api/* endpoints instead of Gemini directly.
// API key stays on the server — never exposed to the browser.

import type { JourneyPlan, ItineraryStep } from '../types';

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export class ApiClient {
  async planJourney(
    prompt: string,
    coords: { lat: number; lng: number } | null,
    area: string | null
  ): Promise<{ plan: JourneyPlan; citations: any[] }> {
    return post('/api/plan', {
      prompt,
      area: area ?? '',
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
    });
  }

  async drift(
    coords: { lat: number; lng: number } | null
  ): Promise<{ step: ItineraryStep; citations: any[] }> {
    return post('/api/drift', {
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
    });
  }

  async refract(step: ItineraryStep): Promise<{ step: ItineraryStep; citations: any[] }> {
    return post('/api/refract', { step });
  }
}
