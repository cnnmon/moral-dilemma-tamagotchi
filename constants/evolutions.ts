import { MoralStatAttribute } from "./morals";

// evolution time frames
const evolutionTimeFrame = {
  0: 2, // 6 dilemmas in age 0 before age 1
  1: 4, // 12 dilemmas in age 1 before age 2
  2: Infinity, // you can see all remaining dilemmas in age 2
}

export function getEvolutionTimeFrame(age: number): number {
  return evolutionTimeFrame[age as keyof typeof evolutionTimeFrame];
}

// evolution types
export type Stage1EvolutionId = "harbinger" | "devout" | "watcher" | "loyalist" | "soldier" | "maverick";

export type Stage2EvolutionId = "monk" | "shepherd" | "arbiter" | "martyr" | "warden" | "wayfarer" | "mercenary" | "guardian" | "patrician" | "sovereign" | "siren" | "npc";

export type EvolutionId = "baby" | Stage1EvolutionId | Stage2EvolutionId;

// represents a stage in pet evolution
type Stage1Evolution = {
  id: Stage1EvolutionId;
  description: string;
  nextStages: Partial<Record<MoralStatAttribute, Stage2EvolutionId>>;
} 

type Stage2Evolution = {
  id: Stage2EvolutionId;
  description: string;
}

type Evolution = {
  id: "baby";
  description: string;
  nextStage: Partial<Record<MoralStatAttribute, Stage1EvolutionId>>;
} | Stage1Evolution | Stage2Evolution;

export const stage0Evolutions: Record<'baby', Evolution> = {
  baby: {
    id: "baby",
    description: "a naive baby bird, curious about the world",
    nextStage: {
      "empathetic": "harbinger",
      "virtuous": "devout",
      "just": "watcher",
      "loyal": "loyalist",
      "authoritarian": "soldier",
      "self-serving": "maverick",
    }
  }
}

export const stage1Evolutions: Record<Stage1EvolutionId, Stage1Evolution> = {
  // empathetic (compassion) -> evolves based on devotion
  harbinger: {
    id: "harbinger",
    description: "a caring envoy who strives to help the world",
    nextStages: {
      "integrous": "monk",
      "loyal": "shepherd",
    },
  },

  // virtuous (purity) -> evolves based on retribution
  devout: { 
    id: "devout",
    description: "a generous soul, seeking purpose in sacrifice",
    nextStages: {
      "just": "arbiter",
      "forgiving": "martyr",
    },
  },

  // forgiveness (retribution) -> evolves based on dominance
  watcher: { 
    id: "watcher",
    description: "a observer who questions their place in justice",
    nextStages: {
      "authoritarian": "warden",
      "autonomous": "wayfarer",
    },
  },

  // loyal (devotion) -> evolves based on ego
  loyalist: { 
    id: "loyalist",
    description: "a steadfast ally bound by duty and trust",
    nextStages: {
      "self-serving": "mercenary",
      "self-sacrificing": "guardian",
    },
  },

  // authoritarian (dominance) -> evolves based on purity
  soldier: { 
    id: "soldier",
    description: "a disciplined enforcer who upholds order and structure",
    nextStages: {
      "virtuous": "patrician",
      "indulgent": "sovereign",
    },
  },

  // self-serving (ego) -> evolves based on compassion
  maverick: { 
    id: "maverick",
    description: "a self-reliant wanderer who seeks purpose",
    nextStages: {
      "indifferent": "npc",
      "empathetic": "siren",
    },
  },
}

export const stage2Evolutions: Record<Stage2EvolutionId, Stage2Evolution> = {
  monk: { // empathetic + integrous
    id: "monk",
    description: "a beacon of unwavering moral clarity",
  },
  shepherd: { // empathetic + loyal
    id: "shepherd",
    description: "a protector who stands warmly by those in need",
  },
  arbiter: { // virtuous + just
    id: "arbiter",
    description: "an unyielding judge upholding decisive impartiality",
  },
  martyr: { // virtuous + forgiving
    id: "martyr",
    description: "a selfless soul, embracing suffering in the name of absolution",
  },
  warden: { // forgiving + authoritarian
    id: "warden",
    description: "a merciful enforcer who believes in redemption",
  },
  wayfarer: { // forgiving + autonomous
    id: "wayfarer",
    description: "a free-spirited healer",
  },
  mercenary: { // loyal + self-serving
    id: "mercenary",
    description: "a fighter who seeks greatness through the help of others",
  },
  guardian: { // loyal + self-sacrificing
    id: "guardian",
    description: "a devoted shield for their allies",
  },
  patrician: { // authoritarian + indulgent
    id: "patrician",
    description: "a devotee of privilege and structure",
  },
  sovereign: { // authoritarian + virtuous
    id: "sovereign",
    description: "a noble and righteous leader",
  },
  siren: { // self-serving + indulgent
    id: "siren",
    description: "a charismatic figure who draws others in to achieve their own purposes",
  },
  npc: { // self-serving + indifferent
    id: "npc",
    description: "a passive bystander to life",
  },
};

const evolutions: Record<EvolutionId, Evolution> = {
  ...stage0Evolutions,
  ...stage1Evolutions,
  ...stage2Evolutions
}

export function getEvolution(id: EvolutionId): Evolution {
  return evolutions[id];
}