import { MoralDimensions, MoralStatAttribute, attributes } from "./morals";

// evolution time frames
const evolutionTimeFrame = {
  0: 5, // in age 0 until age 1 evolution
  1: 8, // in age 1 until age 2 evolution
  2: 13, // until graduation unlocks
}

export function getEvolutionTimeFrame(age: number): number {
  return evolutionTimeFrame[age as keyof typeof evolutionTimeFrame];
}

// evolution types
export type Stage1EvolutionId = "empath" | "devout" | "watcher" | "knight" | "soldier" | "alpha" | "npc";

export type Stage2EvolutionId = "sage" | "shepherd" | "gavel" | "martyr" | "gavel" | "vigilante" | "mercenary" | "guardian" | "hedonist" | "herald" | "cultleader" | "npc";

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

export type Evolution = Stage0Evolution | Stage1Evolution | Stage2Evolution | Stage3Evolution;

export const stage0Evolutions: Record<'baby', Stage0Evolution> = {
  baby: {
    id: "baby",
    description: "curious hatchling taking first steps",
    nextStages: {
      [attributes[MoralDimensions.compassion].high]: "empath",
      [attributes[MoralDimensions.purity].high]: "devout",
      [attributes[MoralDimensions.retribution].high]: "watcher",
      [attributes[MoralDimensions.devotion].high]: "knight",
      [attributes[MoralDimensions.dominance].high]: "soldier",
      [attributes[MoralDimensions.ego].high]: "alpha",
    }
  }
}

export const stage1Evolutions: Record<Stage1EvolutionId, Stage1Evolution> = {
  // follows heart (high compassion) -> evolves based on devotion
  empath: {
    id: "empath",
    description: "sensitive soul torn between empathy for all or loyalty to few",
    nextStages: {
      [attributes[MoralDimensions.devotion].low]: "sage",
      [attributes[MoralDimensions.devotion].high]: "shepherd",
    },
  },

  // virtuous (purity) -> evolves based on retribution
  devout: { 
    id: "devout",
    description: "principled believer balancing mercy and judgment",
    nextStages: {
      [attributes[MoralDimensions.retribution].high]: "gavel",
      [attributes[MoralDimensions.retribution].low]: "martyr",
    },
  },

  // punishment (retribution) -> evolves based on dominance
  watcher: { 
    id: "watcher",
    description: "justice-seeker deciding between personal action or systemic change",
    nextStages: {
      [attributes[MoralDimensions.dominance].high]: "gavel",
      [attributes[MoralDimensions.dominance].low]: "vigilante",
    },
  },

  // loyal (devotion) -> evolves based on ego
  knight: { 
    id: "knight",
    description: "faithful protector questioning if loyalty demands self-sacrifice",
    nextStages: {
      [attributes[MoralDimensions.ego].high]: "mercenary",
      [attributes[MoralDimensions.ego].low]: "guardian",
    },
  },

  // authoritarian (dominance) -> evolves based on purity
  soldier: { 
    id: "soldier",
    description: "disciplined enforcer choosing between rigid virtue or pragmatic power",
    nextStages: {
      [attributes[MoralDimensions.purity].high]: "herald",
      [attributes[MoralDimensions.purity].low]: "hedonist",
    },
  },

  // self-serving (ego) -> evolves based on compassion
  alpha: { 
    id: "alpha",
    description: "independent spirit deciding between solitary freedom or leading others",
    nextStages: {
      [attributes[MoralDimensions.compassion].low]: "npc",
      [attributes[MoralDimensions.compassion].high]: "cultleader",
    },
  },

  // npc (fall-back if no traits are particularly high)
  npc: {
    id: "npc",
    description: "ordinary bird seeking meaning in simplicity",
    nextStages: {
      [attributes[MoralDimensions.devotion].low]: "sage",
      [attributes[MoralDimensions.retribution].low]: "martyr",
      [attributes[MoralDimensions.dominance].low]: "vigilante",
      [attributes[MoralDimensions.ego].low]: "guardian",
      [attributes[MoralDimensions.purity].low]: "hedonist",
      [attributes[MoralDimensions.compassion].low]: "npc",
    },
  },
}

export const stage2Evolutions: Record<Stage2EvolutionId, Stage2Evolution> = {
  sage: { // empathetic + integrous
    id: "sage",
    description: "wise philosopher with universal compassion",
  },
  shepherd: { // empathetic + loyal
    id: "shepherd",
    description: "nurturing guide protecting the vulnerable",
  },
  martyr: { // virtuous + forgiving
    id: "martyr",
    description: "selfless hero bearing others' burdens",
  },
  gavel: { // punishing + authoritarian
    id: "gavel",
    description: "stern judge with unwavering principles",
  },
  vigilante: { // punishing + autonomous
    id: "vigilante",
    description: "rogue healer fighting injustice independently",
  },
  mercenary: { // loyal + self-serving
    id: "mercenary",
    description: "skilled fighter loyal to highest bidder",
  },
  guardian: { // loyal + self-sacrificing
    id: "guardian",
    description: "devoted shield between danger and allies",
  },
  hedonist: { // authoritarian + indulgent
    id: "hedonist",
    description: "privileged elite enjoying power and pleasure",
  },
  herald: { // authoritarian + virtuous
    id: "herald",
    description: "noble ruler guided by higher principles",
  },
  cultleader: { // self-serving + empathetic
    id: "cultleader",
    description: "charismatic visionary inspiring devoted followers",
  },
  npc: { // self-serving + indifferent
    id: "npc",
    description: "ordinary bird content with simple pleasures",
  },
};

// combine all evolutions into a single record
const evolutions: Record<EvolutionId, Evolution> = {
  ...stage0Evolutions,
  ...stage1Evolutions,
  ...stage2Evolutions,
  graduated: {
    id: "graduated",
    description: "fully realized bird who found their true path",
  },
}

export function getEvolution(id: EvolutionId): Evolution {
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
    throw new Error(`invalid stage 2 evolution id: ${finalEvolutionId}`);
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
  for (const [statKey, evolveId] of Object.entries(stage0Evolutions.baby.nextStages)) {
    if (evolveId === stage1Evolution.id) {
      stage1StatKey = statKey as MoralStatAttribute;
      break;
    }
  }

  if (!stage1StatKey) {
    throw new Error(`no stage 0 stat found for ${stage1Evolution.id}`);
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
      id: "baby",
      description: stage0Evolutions.baby.description
    }
  ]
}