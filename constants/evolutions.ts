import { MoralDimensions, MoralStatAttribute, attributes } from "./morals";

// evolution time frames
const evolutionTimeFrame = {
  0: 6, // in age 0 until age 1 evolution
  1: 10, // in age 1 until age 2 evollution
  2: 14, // until graduation
}

export function getEvolutionTimeFrame(age: number): number {
  return evolutionTimeFrame[age as keyof typeof evolutionTimeFrame];
}

// evolution types
export type Stage1EvolutionId = "harbinger" | "devout" | "watcher" | "loyalist" | "soldier" | "maverick";

export type Stage2EvolutionId = "monk" | "shepherd" | "arbiter" | "martyr" | "warden" | "wayfarer" | "mercenary" | "guardian" | "patrician" | "sovereign" | "cultleader" | "npc";

export type EvolutionId = "baby" | "graduated" | Stage1EvolutionId | Stage2EvolutionId;

// represents a stage in pet evolution
type Stage0Evolution = {
  id: "baby";
  description: string;
  nextStages: Partial<Record<MoralStatAttribute, Stage1EvolutionId>>;
}

type Stage1Evolution = {
  id: Stage1EvolutionId;
  description: string;
  nextStages: Partial<Record<MoralStatAttribute, Stage2EvolutionId>>;
} 

type Stage2Evolution = {
  id: Stage2EvolutionId;
  description: string;
}

type Stage3Evolution = {  
  id: "graduated";
  description: string;
}

type Evolution = Stage0Evolution | Stage1Evolution | Stage2Evolution | Stage3Evolution;

export const stage0Evolutions: Record<'baby', Stage0Evolution> = {
  baby: {
    id: "baby",
    description: "a naive baby bird, curious about the world",
    nextStages: {
      [attributes[MoralDimensions.compassion].low]: "harbinger",
      [attributes[MoralDimensions.purity].low]: "devout",
      [attributes[MoralDimensions.retribution].low]: "watcher",
      [attributes[MoralDimensions.devotion].low]: "loyalist",
      [attributes[MoralDimensions.dominance].low]: "soldier",
      [attributes[MoralDimensions.ego].high]: "maverick",
    }
  }
}

export const stage1Evolutions: Record<Stage1EvolutionId, Stage1Evolution> = {
  // empathetic (compassion) -> evolves based on devotion
  harbinger: {
    id: "harbinger",
    description: "a caring envoy who strives to help the world",
    nextStages: {
      [attributes[MoralDimensions.devotion].low]: "monk",
      [attributes[MoralDimensions.devotion].high]: "shepherd",
    },
  },

  // virtuous (purity) -> evolves based on retribution
  devout: { 
    id: "devout",
    description: "a generous soul, seeking purpose in sacrifice",
    nextStages: {
      [attributes[MoralDimensions.retribution].high]: "arbiter",
      [attributes[MoralDimensions.retribution].low]: "martyr",
    },
  },

  // forgiveness (retribution) -> evolves based on dominance
  watcher: { 
    id: "watcher",
    description: "a observer who questions their place in justice",
    nextStages: {
      [attributes[MoralDimensions.dominance].high]: "warden",
      [attributes[MoralDimensions.dominance].low]: "wayfarer",
    },
  },

  // loyal (devotion) -> evolves based on ego
  loyalist: { 
    id: "loyalist",
    description: "a steadfast ally bound by duty and trust",
    nextStages: {
      [attributes[MoralDimensions.ego].high]: "mercenary",
      [attributes[MoralDimensions.ego].low]: "guardian",
    },
  },

  // authoritarian (dominance) -> evolves based on purity
  soldier: { 
    id: "soldier",
    description: "a disciplined enforcer who upholds order and structure",
    nextStages: {
      [attributes[MoralDimensions.purity].high]: "sovereign",
      [attributes[MoralDimensions.purity].low]: "patrician",
    },
  },

  // self-serving (ego) -> evolves based on compassion
  maverick: { 
    id: "maverick",
    description: "a self-reliant wanderer who seeks purpose",
    nextStages: {
      [attributes[MoralDimensions.compassion].low]: "npc",
      [attributes[MoralDimensions.compassion].high]: "cultleader",
    },
  },
}

export const stage2Evolutions: Record<Stage2EvolutionId, Stage2Evolution> = {
  monk: { // empathetic + integrous
    id: "monk",
    description: "a calm and collected figure of unwavering moral clarity",
  },
  shepherd: { // empathetic + loyal
    id: "shepherd",
    description: "a caring protector who stands warmly by those in need",
  },
  arbiter: { // virtuous + just
    id: "arbiter",
    description: "a decisive judge, fair and firm",
  },
  martyr: { // virtuous + forgiving
    id: "martyr",
    description: "a selfless soul who takes on the suffering of others",
  },
  warden: { // forgiving + authoritarian
    id: "warden",
    description: "a strict but merciful enforcer",
  },
  wayfarer: { // forgiving + autonomous
    id: "wayfarer",
    description: "a free spirit, healing and helping wherever they go",
  },
  mercenary: { // loyal + self-serving
    id: "mercenary",
    description: "a fighter seeking greatness through others",
  },
  guardian: { // loyal + self-sacrificing
    id: "guardian",
    description: "a devoted protector who will stand between danger and their allies",
  },
  patrician: { // authoritarian + indulgent
    id: "patrician",
    description: "an enjoyer of structure, privilege, and status",
  },
  sovereign: { // authoritarian + virtuous
    id: "sovereign",
    description: "a noble and righteous leader",
  },
  cultleader: { // self-serving + empathetic
    id: "cultleader",
    description: "a charismatic opportunist who harnesses devotion for personal gain",
  },
  npc: { // self-serving + indifferent
    id: "npc",
    description: "a passive bystander",
  },
};

const evolutions: Record<EvolutionId, Evolution> = {
  ...stage0Evolutions,
  ...stage1Evolutions,
  ...stage2Evolutions,
  graduated: {
    id: "graduated",
    description: "a mature bird of their own making",
  },
}

export function getEvolution(id: EvolutionId): Evolution {
  return evolutions[id];
}