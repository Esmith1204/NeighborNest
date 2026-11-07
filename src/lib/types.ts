// Shapes shared by the browser and the server.

/** What the browser sends; the server re-validates it and looks the parcel up itself. */
export interface ScenarioRequest {
  parcelId: number;
  buildCost: number;
  partnerUpfront: number;
  monthlyRent: number;
  rentToPaydownPct: number;
  partnerRentSubsidy: number;
  karlMonthlyIncome: number;
}

export interface PersonaStory {
  headline: string;
  before: string[];
  after: string[];
}

export interface Story {
  linda: PersonaStory;
  karl: PersonaStory;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
