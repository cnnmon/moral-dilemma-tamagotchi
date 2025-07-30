import { MoralDimensions, MoralStatAttribute, attributes } from "./morals";

// evolution time frames
const evolutionTimeFrame = {
  0: 4, // in age 0 until age 1 evolution
  1: 7, // in age 1 until age 2 evolution
  2: 9, // until graduation unlocks
}

export function getEvolutionTimeFrame(age: number): number {
  return evolutionTimeFrame[age as keyof typeof evolutionTimeFrame];
}

// evolution types
export enum EvolutionId {
  // Base
  BABY = "baby",
  
  // Stage 1
  EMPATH = "empath",
  DEVOUT = "devout",
  WATCHER = "watcher",
  SOLDIER = "soldier",
  TEACHERSPET = "teacher's pet",
  HEDONIST = "hedonist",
  NPC = "npc",
  
  // Stage 2
  GAVEL = "gavel",
  VIGILANTE = "vigilante",
  GODFATHER = "godfather",
  GUARDIAN = "guardian",
  ARISTOCRAT = "aristocrat",
  SIGMA = "sigma",
  SAINT = "saint",
  CULTLEADER = "cultleader",
  
  // Final
  GRADUATED = "graduated",
  RIP = "rip",
}

export type Stage1EvolutionId = 
  | EvolutionId.EMPATH 
  | EvolutionId.DEVOUT 
  | EvolutionId.WATCHER 
  | EvolutionId.SOLDIER 
  | EvolutionId.TEACHERSPET 
  | EvolutionId.HEDONIST 
  | EvolutionId.NPC;

export type Stage2EvolutionId = 
  | EvolutionId.GAVEL 
  | EvolutionId.VIGILANTE 
  | EvolutionId.GODFATHER 
  | EvolutionId.GUARDIAN 
  | EvolutionId.ARISTOCRAT 
  | EvolutionId.NPC 
  | EvolutionId.SIGMA 
  | EvolutionId.SAINT 
  | EvolutionId.CULTLEADER;

export type EvolutionIdType = EvolutionId.BABY | Stage1EvolutionId | Stage2EvolutionId;

// represents a stage in pet evolution
type Stage0Evolution = {
  id: "baby";
  description: string;
  nextStages: Partial<Record<MoralStatAttribute, Stage1EvolutionId>>;
}

type Stage1Evolution = {
  id: Stage1EvolutionId;
  description: string;
  nextStages: Partial<Record<MoralStatAttribute, Stage2EvolutionId | `${Stage2EvolutionId}_${MoralStatAttribute}`>>;
} 

type Stage2Evolution = {
  id: Stage2EvolutionId;
  description: string;
}

type Stage3Evolution = {  
  id: "graduated";
  description: string;
}

export type Evolution = Stage0Evolution | Stage1Evolution | Stage2Evolution | Stage3Evolution;

export const stage0Evolutions: Record<EvolutionId.BABY, Stage0Evolution> = {
  [EvolutionId.BABY]: {
    id: EvolutionId.BABY,
    description: "curious hatchling taking first steps",
    nextStages: {
      [attributes[MoralDimensions.compassion].high]: EvolutionId.EMPATH,
      [attributes[MoralDimensions.purity].high]: EvolutionId.DEVOUT,
      [attributes[MoralDimensions.retribution].high]: EvolutionId.WATCHER,
      [attributes[MoralDimensions.devotion].high]: EvolutionId.TEACHERSPET,
      [attributes[MoralDimensions.dominance].high]: EvolutionId.SOLDIER,
      [attributes[MoralDimensions.ego].high]: EvolutionId.HEDONIST,
    }
  }
}

export const stage1Evolutions: Record<Stage1EvolutionId, Stage1Evolution> = {
  // follows heart (high compassion) -> evolves based on devotion
  [EvolutionId.EMPATH]: {
    id: EvolutionId.EMPATH,
    description: "sensitive soul torn between empathy for all or loyalty to few",
    nextStages: {
      [attributes[MoralDimensions.devotion].low]: `${EvolutionId.CULTLEADER}`,
      [attributes[MoralDimensions.devotion].high]: `${EvolutionId.SAINT}`,
    },
  },

  // virtuous (purity) -> evolves based on retribution
  [EvolutionId.DEVOUT]: { 
    id: EvolutionId.DEVOUT,
    description: "principled believer balancing mercy and judgment",
    nextStages: {
      [attributes[MoralDimensions.retribution].high]: `${EvolutionId.GAVEL}`,
      [attributes[MoralDimensions.retribution].low]: `${EvolutionId.SAINT}`,
    },
  },

  // punishment (retribution) -> evolves based on dominance
  [EvolutionId.WATCHER]: { 
    id: EvolutionId.WATCHER,
    description: "justice-seeker deciding between personal action or systemic change",
    nextStages: {
      [attributes[MoralDimensions.dominance].high]: EvolutionId.GAVEL,
      [attributes[MoralDimensions.dominance].low]: EvolutionId.VIGILANTE,
    },
  },

  // loyal (devotion) -> evolves based on ego
  [EvolutionId.SOLDIER]: { 
    id: EvolutionId.SOLDIER,
    description: "faithful protector questioning if loyalty demands self-sacrifice",
    nextStages: {
      [attributes[MoralDimensions.ego].high]: EvolutionId.GODFATHER,
      [attributes[MoralDimensions.ego].low]: EvolutionId.GUARDIAN,
    },
  },

  // authoritarian (dominance) -> evolves based on purity
  [EvolutionId.TEACHERSPET]: { 
    id: EvolutionId.TEACHERSPET,
    description: "disciplined enforcer choosing between rigid virtue or pragmatic power",
    nextStages: {
      [attributes[MoralDimensions.purity].high]: `${EvolutionId.SAINT}`,
      [attributes[MoralDimensions.purity].low]: EvolutionId.ARISTOCRAT,
    },
  },

  // self-serving (ego) -> evolves based on compassion
  [EvolutionId.HEDONIST]: { 
    id: EvolutionId.HEDONIST,
    description: "independent spirit deciding between solitary freedom or leading others",
    nextStages: {
      [attributes[MoralDimensions.compassion].low]: EvolutionId.SIGMA,
      [attributes[MoralDimensions.compassion].high]: `${EvolutionId.CULTLEADER}`,
    },
  },

  // npc (fall-back if no traits are particularly high)
  [EvolutionId.NPC]: {
    id: EvolutionId.NPC,
    description: "ordinary bird seeking meaning in simplicity",
    nextStages: {
      [attributes[MoralDimensions.purity].low]: EvolutionId.ARISTOCRAT,
      [attributes[MoralDimensions.compassion].low]: EvolutionId.NPC,
    },
  },
}

export const stage2Evolutions: Record<string, Stage2Evolution> = {
  [EvolutionId.GAVEL]: { // punishing + authoritarian
    id: EvolutionId.GAVEL,
    description: "stern judge with unwavering principles",
  },
  [EvolutionId.VIGILANTE]: { // punishing + autonomous
    id: EvolutionId.VIGILANTE,
    description: "rogue healer fighting injustice independently",
  },
  [EvolutionId.GODFATHER]: { // loyal + self-serving
    id: EvolutionId.GODFATHER,
    description: "skilled self-imposed authority demanding a tribal loyalty",
  },
  [EvolutionId.GUARDIAN]: { // loyal + self-sacrificing
    id: EvolutionId.GUARDIAN,
    description: "devoted shield between danger and allies",
  },
  [EvolutionId.ARISTOCRAT]: { // authoritarian + indulgent
    id: EvolutionId.ARISTOCRAT,
    description: "privileged elite enjoying power and pleasure",
  },
  [EvolutionId.SAINT]: { // authoritarian + virtuous
    id: EvolutionId.SAINT,
    description: "noble ruler guided by higher principles",
  },
  [EvolutionId.CULTLEADER]: { // self-serving + empathetic
    id: EvolutionId.CULTLEADER,
    description: "charismatic leader building following for personal gain",
  },
  [EvolutionId.NPC]: { // fall-back if no traits are particularly high
    id: EvolutionId.NPC,
    description: "ordinary bird content with simple pleasures",
  },
  [EvolutionId.SIGMA]: { // self-serving + logic
    id: EvolutionId.SIGMA,
    description: "detached strategist forging their own path",
  },
};

// combine all evolutions into a single record
export const evolutions: Record<string, Evolution> = {
  ...stage0Evolutions,
  ...stage1Evolutions,
  ...stage2Evolutions,
}

export function getEvolution(id: EvolutionId): Evolution {
  if (!(id in evolutions)) {
    // gracefully handle
    return evolutions.npc;
  }
  return evolutions[id];
}

export const evolutionToStat = {
  [EvolutionId.EMPATH]: "high compassion",
  [EvolutionId.DEVOUT]: "high purity",
  [EvolutionId.WATCHER]: "high retribution",
  [EvolutionId.SOLDIER]: "high dominance",
  [EvolutionId.TEACHERSPET]: "high loyalty",
  [EvolutionId.HEDONIST]: "high ego",
  [EvolutionId.NPC]: "balanced traits",
  [EvolutionId.GAVEL]: "high retribution + high dominance",
  [EvolutionId.VIGILANTE]: "high retribution + high personal integrity", 
  [EvolutionId.GODFATHER]: "high dominance + high ego",
  [EvolutionId.GUARDIAN]: "high dominance + high selflessness",
  [EvolutionId.ARISTOCRAT]: "high loyalty + high indulgence",
  [EvolutionId.SIGMA]: "high ego + high logic",
  [EvolutionId.SAINT]: "high virtue + high loyalty",
  [EvolutionId.CULTLEADER]: "high charisma + high personal integrity",
  [EvolutionId.BABY]: "developing traits",
  [EvolutionId.GRADUATED]: "mastered growth",
  [EvolutionId.RIP]: "failed to thrive",
}