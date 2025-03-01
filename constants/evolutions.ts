import { MoralDimensions, MoralStatAttribute, attributes } from "./morals";

// evolution time frames
const evolutionTimeFrame = {
  0: 5, // in age 0 until age 1 evolution
  1: 10, // in age 1 until age 2 evolution
  2: 13, // until graduation
}

export function getEvolutionTimeFrame(age: number): number {
  return evolutionTimeFrame[age as keyof typeof evolutionTimeFrame];
}

// evolution types
export type Stage1EvolutionId = "empath" | "devout" | "watcher" | "loyalist" | "soldier" | "maverick" | "npc";

export type Stage2EvolutionId = "monk" | "shepherd" | "arbiter" | "martyr" | "judge" | "vigilante" | "mercenary" | "guardian" | "patrician" | "sovereign" | "cultleader" | "npc";

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
    description: "a naive baby bird, curious about the world",
    nextStages: {
      [attributes[MoralDimensions.compassion].high]: "empath", // fixed from harbinger to empath
      [attributes[MoralDimensions.purity].high]: "devout",
      [attributes[MoralDimensions.retribution].high]: "watcher",
      [attributes[MoralDimensions.devotion].high]: "loyalist",
      [attributes[MoralDimensions.dominance].high]: "soldier",
      [attributes[MoralDimensions.ego].high]: "maverick",
    }
  }
}

export const stage1Evolutions: Record<Stage1EvolutionId, Stage1Evolution> = {
  // empathetic (compassion) -> evolves based on devotion
  empath: {
    id: "empath",
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

  // punishment (retribution) -> evolves based on dominance
  watcher: { 
    id: "watcher",
    description: "a observer who questions their place in justice",
    nextStages: {
      [attributes[MoralDimensions.dominance].high]: "judge",
      [attributes[MoralDimensions.dominance].low]: "vigilante",
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
  // npc (fall-back)
  npc: {
    id: "npc",
    description: "a passive bystander",
    nextStages: {
      [attributes[MoralDimensions.devotion].low]: "monk",
      [attributes[MoralDimensions.retribution].low]: "martyr",
      [attributes[MoralDimensions.dominance].low]: "vigilante",
      [attributes[MoralDimensions.ego].low]: "guardian",
      [attributes[MoralDimensions.purity].low]: "patrician",

      // fallback if no high stats
      [attributes[MoralDimensions.compassion].low]: "npc",
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
  judge: { // punishing + authoritarian
    id: "judge",
    description: "a strict but merciful enforcer",
  },
  vigilante: { // punishing + autonomous
    id: "vigilante",
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

// combine all evolutions into a single record
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