// moral stats range from 0-10
export enum MoralDimensions {
  compassion = "compassion", 
  retribution = "retribution",
  devotion = "devotion",
  dominance = "dominance",
  purity = "purity",
  ego = "ego",
}

export type MoralStatAttribute =
  | "logical"
  | "emotional"
  | "forgiving"
  | "punishing"
  | "integrous"
  | "loyal"
  | "autonomous"
  | "authoritarian"
  | "indulgent"
  | "virtuous"
  | "self-serving"
  | "self-sacrificing";

export const attributes: Record<MoralDimensions, { low: MoralStatAttribute; high: MoralStatAttribute }> = {
  [MoralDimensions.compassion]: {
    low: "logical",
    high: "emotional",
  },
  [MoralDimensions.retribution]: {
    low: "forgiving",
    high: "punishing",
  },
  [MoralDimensions.devotion]: {
    low: "integrous",
    high: "loyal",
  },
  [MoralDimensions.dominance]: {
    low: "autonomous",
    high: "authoritarian",
  },
  [MoralDimensions.purity]: {
    low: "indulgent",
    high: "virtuous",
  },
  [MoralDimensions.ego]: {
    low: "self-sacrificing",
    high: "self-serving",
  },
};

type MoralStatsWritten = {
  key: string;
  description: string;
  percentage: number;
  value: number;
};

export function getMoralStatsWritten(
  moralStats: MoralDimensionsType,
  forEvolution: boolean = false // if true, only returns the attribute & returns all attributes; used to determine best next evolution
): MoralStatsWritten[] {
  const stats = Object.entries(moralStats).reduce(
    (acc, [key, value]) => {
      if (value === 5 && !forEvolution) {
        return acc;
      }

      let prefix: string;
      if (value > 7 || value < 3) {
        prefix = "highly ";
      } else if (value > 6 || value < 4) {
        prefix = "moderately ";
      } else {
        prefix = "mildly ";
      }

      const range = attributes[key as MoralDimensions];
      let description: string;
      if (value > 5) {
        description = range.high;
      } else {
        description = range.low;
      }

      const percentage = Math.abs(value - 5) * 20;

      acc.push({
        key,
        description: `${!forEvolution ? prefix : ""}${description}`,
        percentage,
        value,
      });

      return acc;
    },
    [] as MoralStatsWritten[]
  );

  // sort by intensity value
  return stats.sort((a, b) => Math.abs(b.value - 5) - Math.abs(a.value - 5));
}

export type MoralDimensionsType = Record<MoralDimensions, number>;
