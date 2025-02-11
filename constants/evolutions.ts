import { MoralDimensions, MoralDimensionsType } from "./morals";

// evolution time frames

const evolutionTimeFrame = {
  0: 2, // 6 dilemmas in age 0 before age 1
  1: 4, // 12 dilemmas in age 1 before age 2
  2: -1, // you can see all the dilemmas in age 2
}

export function getEvolutionTimeFrame(age: number): number {
  return evolutionTimeFrame[age as keyof typeof evolutionTimeFrame];
}

// evolution types

export type Stage1EvolutionId = "harbinger" | "devout" | "watcher" | "loyalist" | "crowned" | "sigma";

export type Stage2EvolutionId = "judge" | "shepherd" | "beacon" | "martyr" | "warden" | "vigilante" | "champion" | "guardian" | "tyrant" | "sovereign" | "hedonist" | "npc";

export type EvolutionId = "baby" | Stage1EvolutionId | Stage2EvolutionId;

// represents a stage in pet evolution
type Evolution = {
  id: "baby";
  description: string;
  nextStage: Stage1EvolutionId[];
} | {
  id: Stage1EvolutionId;
  description: string;
  requirements: Partial<MoralDimensionsType>;
  nextStages: Stage2EvolutionId[];
} | {
  id: Stage2EvolutionId;
  description: string;
  requirements: Partial<MoralDimensionsType>;
};

export const stage1Evolutions: Record<Stage1EvolutionId, Evolution> = {
  harbinger: {
    id: "harbinger",
    description: "a judge who is always ready to make a decision",
    requirements: {
      [MoralDimensions.compassion]: 1, // empathy
    },
    nextStages: ["judge", "shepherd"],
  },
  devout: {
    id: "devout",
    description: "a martyr who is always ready to make a sacrifice",
    requirements: {
      [MoralDimensions.purity]: 1, // virtue
    },
    nextStages: ["martyr", "warden"],
  },
  watcher: {
    id: "watcher",
    description: "a warden who is always ready to protect",
    requirements: {
      [MoralDimensions.retribution]: 1, // justice
    },
    nextStages: ["warden", "vigilante"],
  },
  loyalist: {
    id: "loyalist",
    description: "a guardian who is always ready to protect",
    requirements: {
      [MoralDimensions.devotion]: 1, // loyalty
    },
    nextStages: ["guardian", "champion"],
  },
  crowned: {
    id: "crowned",
    description: "a tyrant who is always ready to rule",
    requirements: {
      [MoralDimensions.dominance]: 1, // authority
    },
    nextStages: ["tyrant", "sovereign"],
  },
  sigma: {
    id: "sigma",
    description: "a hedonist who is always ready to indulge",
    requirements: {
      [MoralDimensions.ego]: 10, // selfhood
    },
    nextStages: ["hedonist", "npc"],
  },
}

export const stage2Evolutions: Record<Stage2EvolutionId, Evolution> = {
  // stage 2
  judge: {
    id: "judge",
    description: "an arbiter who embodies integrity",
    requirements: {
      [MoralDimensions.devotion]: 10, // integrity
    },
  },
  shepherd: {
    id: "shepherd",
    description: "a guide who embodies loyalty",
    requirements: {
      [MoralDimensions.devotion]: 1, // loyalty
    },
  },
  beacon: {
    id: "beacon",
    description: "a beacon of justice",
    requirements: {
      [MoralDimensions.retribution]: 1, // justice
    },
  },
  martyr: {
    id: "martyr",
    description: "a symbol of forgiveness",
    requirements: {
      [MoralDimensions.retribution]: 1, // forgiveness
    },
  },
  warden: {
    id: "warden",
    description: "a protector of authority",
    requirements: {
      [MoralDimensions.dominance]: 1, // authority
    },
  },
  vigilante: {
    id: "vigilante",
    description: "an advocate of autonomy",
    requirements: {
      [MoralDimensions.dominance]: 1, // autonomy
    },
  },
  champion: {
    id: "champion",
    description: "a paragon of integrity",
    requirements: {
      [MoralDimensions.devotion]: 1, // integrity
    },
  },
  guardian: {
    id: "guardian",
    description: "a defender of justice",
    requirements: {
      [MoralDimensions.retribution]: 1, // justice
    },
  },
  tyrant: {
    id: "tyrant",
    description: "a ruler of indulgence",
    requirements: {
      [MoralDimensions.purity]: 1, // indulgence
    },
  },
  sovereign: {
    id: "sovereign",
    description: "a leader of virtue",
    requirements: {
      [MoralDimensions.purity]: 1, // virtue
    },
  },
  hedonist: {
    id: "hedonist",
    description: "a seeker of indulgence",
    requirements: {
      [MoralDimensions.ego]: 1, // indulgence
    },
  },
  npc: {
    id: "npc",
    description: "an embodiment of indifference",
    requirements: {
      [MoralDimensions.compassion]: 1, // indifference
    },
  },
};

const evolutions: Record<EvolutionId, Evolution> = {
  baby: {
    id: "baby",
    description: "a naive baby bird",
    nextStage: ["harbinger", "devout", "watcher", "loyalist", "crowned", "sigma"],
  },
  ...stage1Evolutions,
  ...stage2Evolutions
}

export function getEvolution(id: EvolutionId): Evolution {
  return evolutions[id];
}