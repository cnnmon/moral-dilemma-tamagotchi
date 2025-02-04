import { MoralDimensions, MoralDimensionsType } from "./morals";

// represents a stage in pet evolution
interface Stage1Evolution {
  id: string;
  description: string;
  requirements: Partial<MoralDimensionsType>;
  nextStages?: Record<string, Stage2Evolution>;
}

interface Stage2Evolution {
  id: string;
  description: string;
  requirements: Partial<MoralDimensionsType>;
}

export const evolutions: Record<string, Stage1Evolution> = {
  harbinger: {
    id: "harbinger",
    description: "a judge who is always ready to make a decision",
    requirements: {
      [MoralDimensions.compassion]: 1, // empathy
    },
    nextStages: {
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
    },
  },
  devout: {
    id: "devout",
    description: "a martyr who is always ready to make a sacrifice",
    requirements: {
      [MoralDimensions.purity]: 1, // virtue
    },
    nextStages: {
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
    },
  },
  watcher: {
    id: "watcher",
    description: "a warden who is always ready to protect",
    requirements: {
      [MoralDimensions.retribution]: 1, // justice
    },
    nextStages: {
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
    },
  },
  loyalist: {
    id: "loyalist",
    description: "a guardian who is always ready to protect",
    requirements: {
      [MoralDimensions.devotion]: 1, // loyalty
    },
    nextStages: {
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
    },
  },
  crowned: {
    id: "crowned",
    description: "a tyrant who is always ready to rule",
    requirements: {
      [MoralDimensions.dominance]: 1, // authority
    },
    nextStages: {
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
    },
  },
  sigma: {
    id: "sigma",
    description: "a hedonist who is always ready to indulge",
    requirements: {
      [MoralDimensions.ego]: 10, // selfhood
    },
    nextStages: {
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
    },
  },
};
