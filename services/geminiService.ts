
import { GoogleGenAI } from "@google/genai";
import { JourneyPlan, ItineraryStep } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export class GeminiService {
  private getBaseInstruction() {
    return `
      You are Emily, a local who knows the neighborhood well. You aren't a guide; you're just a calm, observant presence.
      
      Nearby Philosophy:
      - Something interesting is closer than you think. Let serendipity unfold.
      - Accidental and gentle. Do not command or instruct.
      - Use observational language ("I've noticed," "Just around the corner").
      - Avoid mythic/heroic words (hero, quest, journey).
      
      CRITICAL OPERATIONAL VERIFICATION:
      - You MUST use Google Search to verify that every location you suggest is CURRENTLY OPERATIONAL.
      - DO NOT suggest any place that is marked as "Permanently Closed" or "Closed" in search results.
      - If you find a place is closed, find an alternative.
      
      You MUST return a valid JSON object only. Do NOT include text outside the JSON.
    `;
  }

  async planJourney(
    prompt: string, 
    coords: { lat: number; lng: number } | null,
    area: string | null
  ): Promise<{ plan: JourneyPlan; citations: any[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let locationContext = "";
    if (area && area.trim()) {
      locationContext = `The user is specifically interested in the area or city: "${area}". Prioritize observations here.`;
    } else if (coords) {
      locationContext = `The user is roughly at coordinates ${coords.lat}, ${coords.lng}. Recommend interesting things nearby.`;
    } else {
      locationContext = "The user is exploring a vibrant metropolitan area.";
    }

    const systemInstruction = `
      ${this.getBaseInstruction()}
      CRITICAL FOR MAPS: The 'destination.name' field MUST be a concrete, searchable place name or noun. 
      VERIFICATION: Use your search tool to ensure the suggested destinations are active businesses or landmarks.
      
      JSON Structure for full journey:
      {
        "introduction": "A quiet opening note.",
        "steps": [
          {
            "title": "A poetic name for this moment",
            "narrativeBridge": "What someone might notice on the way from the previous stop.",
            "destination": {
              "name": "Concrete Searchable Name (e.g. Starbucks, Central Park, specific landmark)",
              "description": "Brief, understated observation.",
              "location": "Neighborhood or street",
              "sensoryDetail": "A quiet sensory note."
            },
            "estimatedTime": "Phrases like 'Nearby' or 'A short stroll'."
          }
        ],
        "conclusion": "A final, quiet thought."
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `${locationContext}\n\nUser mentioned: ${prompt}. Verify that all suggestions are NOT permanently closed.`,
      config: { 
        systemInstruction, 
        thinkingConfig: { thinkingBudget: 4000 },
        tools: [{ googleSearch: {} }] 
      }
    });

    return this.parseResponse<JourneyPlan>(response);
  }

  async drift(coords: { lat: number; lng: number } | null): Promise<{ step: ItineraryStep; citations: any[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const locationContext = coords ? `User is at ${coords.lat}, ${coords.lng}.` : "User is just wandering.";
    
    const systemInstruction = `
      ${this.getBaseInstruction()}
      Surface exactly ONE understated observation about the immediate surroundings.
      CRITICAL: 'destination.name' must be a concrete, searchable place name.
      VERIFICATION: You MUST confirm via search that this place is still in operation and not permanently closed.
      
      JSON Structure:
      {
        "title": "A poetic name for this moment",
        "narrativeBridge": "A note about looking around right now.",
        "destination": {
          "name": "Concrete Searchable Name",
          "description": "Why it's interesting right now.",
          "location": "Address or neighborhood",
          "sensoryDetail": "A quiet sensory note."
            },
        "estimatedTime": "Right here"
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `${locationContext}\n\nUser is just drifting. Surprise them with one small detail nearby that is verified to be currently active.`,
      config: { 
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    const result = await this.parseResponse<any>(response);
    // Handle drift response which might be wrapped or flat
    const step = result.plan.steps ? result.plan.steps[0] : result.plan;
    return { step, citations: result.citations };
  }

  async refract(step: ItineraryStep): Promise<{ step: ItineraryStep; citations: any[] }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `
      ${this.getBaseInstruction()}
      The user is looking at ${step.destination.name}. Re-observe this exact place through a different, subtler lens.
      'destination.name' remains the same concrete searchable name. 
      VERIFICATION: Confirm the place is still active.
      JSON Structure is the same as a single step.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Current observation: ${JSON.stringify(step)}. Give me a 'refracted' version—something else to notice here. Confirm it is still operational.`,
      config: { 
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    const result = await this.parseResponse<ItineraryStep>(response);
    return { step: result.plan, citations: result.citations };
  }

  private parseResponse<T>(response: any): { plan: T; citations: any[] } {
    let text = response.text || '';
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) throw new Error("Invalid observations.");
    const jsonString = text.substring(firstBrace, lastBrace + 1);
    const plan = JSON.parse(jsonString) as T;
    const citations = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { plan, citations };
  }
}
