import { MoralDimension } from "./morals";

export type Evolution = {
  name: string;
  category: MoralDimension;
  description: string;
  nextStage?: string[]; // optional property for next stage evolutions
};

export const stage1Evolutions: Record<string, Evolution> = {
  harbinger: {
    name: "harbinger",
    description: "a judge who is always ready to make a decision",
    category: "compassion",
    nextStage: ["judge", "shepherd"],
  },
  devout: {
    name: "devout",
    description: "a martyr who is always ready to make a sacrifice",
    category: "purity",
    nextStage: ["beacon", "martyr"],
  },
  watcher: {
    name: "watcher",
    description: "a warden who is always ready to protect",
    category: "retribution",
    nextStage: ["warden", "vigilante"],
  },
  loyalist: {
    name: "loyalist",
    description: "a guardian who is always ready to protect",
    category: "devotion",
    nextStage: ["champion", "guardian"],
  },
  crowned: {
    name: "crowned",
    description: "a tyrant who is always ready to rule",
    category: "dominance",
    nextStage: ["tyrant", "sovereign"],
  },
  sigma: {
    name: "sigma",
    description: "a hedonist who is always ready to indulge",
    category: "ego",
    nextStage: ["hedonist", "npc"],
  },
};

export const stage2Evolutions: Record<string, Evolution> = {
  judge: {
    name: "judge",
    description: "an arbiter who embodies integrity",
    category: "devotion",
  },
  shepherd: {
    name: "shepherd",
    description: "a guide who embodies loyalty",
    category: "devotion",
  },
  beacon: {
    name: "beacon",
    description: "a beacon of justice",
    category: "retribution",
  },
  martyr: {
    name: "martyr",
    description: "a symbol of forgiveness",
    category: "retribution",
  },
  warden: {
    name: "warden",
    description: "a protector of authority",
    category: "dominance",
  },
  vigilante: {
    name: "vigilante",
    description: "an advocate of autonomy",
    category: "dominance",
  },
  champion: {
    name: "champion",
    description: "a paragon of integrity",
    category: "devotion",
  },
  guardian: {
    name: "guardian",
    description: "a defender of justice",
    category: "retribution",
  },
  tyrant: {
    name: "tyrant",
    description: "a ruler of indulgence",
    category: "purity",
  },
  sovereign: {
    name: "sovereign",
    description: "a leader of virtue",
    category: "purity",
  },
  hedonist: {
    name: "hedonist",
    description: "a seeker of indulgence",
    category: "ego",
  },
  npc: {
    name: "npc",
    description: "an embodiment of indifference",
    category: "compassion",
  },
};
