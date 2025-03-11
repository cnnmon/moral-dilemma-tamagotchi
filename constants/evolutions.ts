import { MoralDimensions, MoralStatAttribute, attributes } from "./morals";

// evolution time frames
const evolutionTimeFrame = {
  0: 5, // in age 0 until age 1 evolution
  1: 9, // in age 1 until age 2 evolution
  2: 10, // until graduation unlocks
}

export function getEvolutionTimeFrame(age: number): number {
  return evolutionTimeFrame[age as keyof typeof evolutionTimeFrame];
}

// evolution types
export enum EvolutionIdEnum {
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
  GRADUATED = "graduated"
}

export type Stage1EvolutionId = 
  | EvolutionIdEnum.EMPATH 
  | EvolutionIdEnum.DEVOUT 
  | EvolutionIdEnum.WATCHER 
  | EvolutionIdEnum.SOLDIER 
  | EvolutionIdEnum.TEACHERSPET 
  | EvolutionIdEnum.HEDONIST 
  | EvolutionIdEnum.NPC;

export type Stage2EvolutionId = 
  | EvolutionIdEnum.GAVEL 
  | EvolutionIdEnum.VIGILANTE 
  | EvolutionIdEnum.GODFATHER 
  | EvolutionIdEnum.GUARDIAN 
  | EvolutionIdEnum.ARISTOCRAT 
  | EvolutionIdEnum.NPC 
  | EvolutionIdEnum.SIGMA 
  | EvolutionIdEnum.SAINT 
  | EvolutionIdEnum.CULTLEADER;

export type EvolutionId = EvolutionIdEnum.BABY | Stage1EvolutionId | Stage2EvolutionId;

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

export const stage0Evolutions: Record<EvolutionIdEnum.BABY, Stage0Evolution> = {
  [EvolutionIdEnum.BABY]: {
    id: EvolutionIdEnum.BABY,
    description: "curious hatchling taking first steps",
    nextStages: {
      [attributes[MoralDimensions.compassion].high]: EvolutionIdEnum.EMPATH,
      [attributes[MoralDimensions.purity].high]: EvolutionIdEnum.DEVOUT,
      [attributes[MoralDimensions.retribution].high]: EvolutionIdEnum.WATCHER,
      [attributes[MoralDimensions.devotion].high]: EvolutionIdEnum.TEACHERSPET,
      [attributes[MoralDimensions.dominance].high]: EvolutionIdEnum.SOLDIER,
      [attributes[MoralDimensions.ego].high]: EvolutionIdEnum.HEDONIST,
    }
  }
}

export const stage1Evolutions: Record<Stage1EvolutionId, Stage1Evolution> = {
  // follows heart (high compassion) -> evolves based on devotion
  [EvolutionIdEnum.EMPATH]: {
    id: EvolutionIdEnum.EMPATH,
    description: "sensitive soul torn between empathy for all or loyalty to few",
    nextStages: {
      [attributes[MoralDimensions.devotion].low]: `${EvolutionIdEnum.CULTLEADER}_empath`,
      [attributes[MoralDimensions.devotion].high]: `${EvolutionIdEnum.SAINT}_empath`,
    },
  },

  // virtuous (purity) -> evolves based on retribution
  [EvolutionIdEnum.DEVOUT]: { 
    id: EvolutionIdEnum.DEVOUT,
    description: "principled believer balancing mercy and judgment",
    nextStages: {
      [attributes[MoralDimensions.retribution].high]: `${EvolutionIdEnum.GAVEL}_devout`,
      [attributes[MoralDimensions.retribution].low]: `${EvolutionIdEnum.SAINT}_devout`,
    },
  },

  // punishment (retribution) -> evolves based on dominance
  [EvolutionIdEnum.WATCHER]: { 
    id: EvolutionIdEnum.WATCHER,
    description: "justice-seeker deciding between personal action or systemic change",
    nextStages: {
      [attributes[MoralDimensions.dominance].high]: EvolutionIdEnum.GAVEL,
      [attributes[MoralDimensions.dominance].low]: EvolutionIdEnum.VIGILANTE,
    },
  },

  // loyal (devotion) -> evolves based on ego
  [EvolutionIdEnum.SOLDIER]: { 
    id: EvolutionIdEnum.SOLDIER,
    description: "faithful protector questioning if loyalty demands self-sacrifice",
    nextStages: {
      [attributes[MoralDimensions.ego].high]: EvolutionIdEnum.GODFATHER,
      [attributes[MoralDimensions.ego].low]: EvolutionIdEnum.GUARDIAN,
    },
  },

  // authoritarian (dominance) -> evolves based on purity
  [EvolutionIdEnum.TEACHERSPET]: { 
    id: EvolutionIdEnum.TEACHERSPET,
    description: "disciplined enforcer choosing between rigid virtue or pragmatic power",
    nextStages: {
      [attributes[MoralDimensions.purity].high]: `${EvolutionIdEnum.SAINT}_soldier`,
      [attributes[MoralDimensions.purity].low]: EvolutionIdEnum.ARISTOCRAT,
    },
  },

  // self-serving (ego) -> evolves based on compassion
  [EvolutionIdEnum.HEDONIST]: { 
    id: EvolutionIdEnum.HEDONIST,
    description: "independent spirit deciding between solitary freedom or leading others",
    nextStages: {
      [attributes[MoralDimensions.compassion].low]: EvolutionIdEnum.SIGMA,
      [attributes[MoralDimensions.compassion].high]: `${EvolutionIdEnum.CULTLEADER}_${EvolutionIdEnum.HEDONIST}`,
    },
  },

  // npc (fall-back if no traits are particularly high)
  [EvolutionIdEnum.NPC]: {
    id: EvolutionIdEnum.NPC,
    description: "ordinary bird seeking meaning in simplicity",
    nextStages: {
      [attributes[MoralDimensions.purity].low]: EvolutionIdEnum.ARISTOCRAT,
      [attributes[MoralDimensions.compassion].low]: EvolutionIdEnum.NPC,
    },
  },
}

export const stage2Evolutions: Record<string, Stage2Evolution> = {
  [`${EvolutionIdEnum.CULTLEADER}_${EvolutionIdEnum.EMPATH}`]: { // empathetic + personally integrous
    id: EvolutionIdEnum.CULTLEADER,
    description: "compassionate visionary creating community through emotional connection",
  },
  [`${EvolutionIdEnum.SAINT}_${EvolutionIdEnum.EMPATH}`]: { // virtuous + forgiving
    id: EvolutionIdEnum.SAINT,
    description: "selfless hero bearing others' burdens",
  },
  [EvolutionIdEnum.GAVEL]: { // punishing + authoritarian
    id: EvolutionIdEnum.GAVEL,
    description: "stern judge with unwavering principles",
  },
  [EvolutionIdEnum.VIGILANTE]: { // punishing + autonomous
    id: EvolutionIdEnum.VIGILANTE,
    description: "rogue healer fighting injustice independently",
  },
  [EvolutionIdEnum.GODFATHER]: { // loyal + self-serving
    id: EvolutionIdEnum.GODFATHER,
    description: "skilled self-imposed authority demanding a tribal loyalty",
  },
  [EvolutionIdEnum.GUARDIAN]: { // loyal + self-sacrificing
    id: EvolutionIdEnum.GUARDIAN,
    description: "devoted shield between danger and allies",
  },
  [EvolutionIdEnum.ARISTOCRAT]: { // authoritarian + indulgent
    id: EvolutionIdEnum.ARISTOCRAT,
    description: "privileged elite enjoying power and pleasure",
  },
  [`${EvolutionIdEnum.SAINT}_${EvolutionIdEnum.SOLDIER}`]: { // authoritarian + virtuous
    id: EvolutionIdEnum.SAINT,
    description: "noble ruler guided by higher principles",
  },
  [`${EvolutionIdEnum.CULTLEADER}_${EvolutionIdEnum.HEDONIST}`]: { // self-serving + empathetic
    id: EvolutionIdEnum.CULTLEADER,
    description: "charismatic leader building following for personal gain",
  },
  [EvolutionIdEnum.NPC]: { // fall-back if no traits are particularly high
    id: EvolutionIdEnum.NPC,
    description: "ordinary bird content with simple pleasures",
  },
  [EvolutionIdEnum.SIGMA]: { // self-serving + logic
    id: EvolutionIdEnum.SIGMA,
    description: "detached strategist forging their own path",
  },
};

// combine all evolutions into a single record
const evolutions: Record<string, Evolution> = {
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

// type for evolution path data
export type EvolutionPath = {
  stage: string;
  id: string;
  description: string;
  statUsed?: {
    dimension: MoralDimensions;
    value: 'high' | 'low';
    name: MoralStatAttribute;
  };
}

// helper function to get stat information
function getStatUsed(statKey: MoralStatAttribute): {
  dimension: MoralDimensions;
  value: 'high' | 'low';
  name: MoralStatAttribute;
} {
  // find which dimension this stat belongs to
  const dimension = Object.entries(attributes).find(([, attr]) => 
    attr.high === statKey || attr.low === statKey
  )?.[0] as MoralDimensions;
  
  // determine if it's a high or low value
  const value = attributes[dimension].high === statKey ? 'high' : 'low';
  
  return {
    dimension,
    value,
    name: attributes[dimension][value]
  }
}

// get the full evolution path for a final evolution
export function getEvolutions(finalEvolutionId: Stage2EvolutionId): EvolutionPath[] {
  // get stage 2 evolution
  const stage2Evolution = stage2Evolutions[finalEvolutionId];

  if (!stage2Evolution) {
    // gracefully handle
    return [{
      stage: "stage 2",
      id: EvolutionIdEnum.NPC,
      description: stage2Evolutions[EvolutionIdEnum.NPC].description,
      statUsed: {
        dimension: MoralDimensions.compassion,
        value: "low",
        name: attributes[MoralDimensions.compassion].low
      }
    }, {
      stage: "stage 1",
      id: EvolutionIdEnum.NPC,
      description: stage1Evolutions[EvolutionIdEnum.NPC].description,
      statUsed: {
        dimension: MoralDimensions.compassion,
        value: "low",
        name: attributes[MoralDimensions.compassion].low
      }
    }, {
      stage: "stage 0",
      id: EvolutionIdEnum.BABY,
      description: stage0Evolutions[EvolutionIdEnum.BABY].description
    }]
  }

  // find stage 1 evolution and the stat that led to stage 2
  let stage1Evolution: Stage1Evolution | undefined;
  let stage2StatKey: MoralStatAttribute | undefined;
  
  // search through all stage 1 evolutions to find which one leads to our final evolution
  for (const [, evolution] of Object.entries(stage1Evolutions)) {
    for (const [statKey, evolveId] of Object.entries(evolution.nextStages)) {
      if (evolveId === finalEvolutionId) {
        stage1Evolution = evolution;
        stage2StatKey = statKey as MoralStatAttribute;
        break;
      }
    }
    if (stage1Evolution) break;
  }

  if (!stage1Evolution || !stage2StatKey) {
    throw new Error(`no stage 1 evolution found for ${finalEvolutionId}`);
  }

  // find which stat from stage 0 led to stage 1
  let stage1StatKey: MoralStatAttribute | undefined;
  for (const [statKey, evolveId] of Object.entries(stage0Evolutions[EvolutionIdEnum.BABY].nextStages)) {
    if (evolveId === stage1Evolution.id) {
      stage1StatKey = statKey as MoralStatAttribute;
      break;
    }
  }

  if (!stage1StatKey) {
    return [{
      stage: "stage 2",
      id: stage2Evolution.id,
      description: stage2Evolution.description,
      statUsed: getStatUsed(stage2StatKey)
    }, {
      stage: "stage 1",
      id: stage1Evolution.id,
      description: stage1Evolution.description,
      statUsed: {
        dimension: MoralDimensions.compassion,
        value: "low",
        name: attributes[MoralDimensions.compassion].low
      }
    }, {
      stage: "stage 0",
      id: EvolutionIdEnum.BABY,
      description: stage0Evolutions[EvolutionIdEnum.BABY].description
    }]
  }

  // build the complete evolution path
  return [
    {
      stage: "stage 2",
      id: stage2Evolution.id, 
      description: stage2Evolution.description,
      statUsed: getStatUsed(stage2StatKey)
    },
    {
      stage: "stage 1",
      id: stage1Evolution.id,
      description: stage1Evolution.description,
      statUsed: getStatUsed(stage1StatKey)
    },
    {
      stage: "stage 0",
      id: EvolutionIdEnum.BABY,
      description: stage0Evolutions[EvolutionIdEnum.BABY].description
    }
  ]
}