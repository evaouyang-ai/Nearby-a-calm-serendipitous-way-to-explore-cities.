
export interface POI {
  name: string;
  description: string;
  location: string;
  sensoryDetail: string;
  mapsUrl?: string;
  vibe?: string;
  coordinate?: { lat: number; lng: number };
}

export interface ItineraryStep {
  title: string;
  narrativeBridge: string;
  destination: POI;
  estimatedTime: string;
}

export interface JourneyPlan {
  introduction: string;
  steps: ItineraryStep[];
  conclusion: string;
  storyboardImages?: string[];
}

export interface JourneyMemory {
  id: string;
  plan: JourneyPlan;
  citations: any[];
  timestamp: number;
}

export enum JourneyPhase {
  SETUP = 'SETUP',
  INPUT = 'INPUT',
  PLANNING = 'PLANNING',
  AMBIENT = 'AMBIENT',
  STORYBOARD = 'STORYBOARD'
}
