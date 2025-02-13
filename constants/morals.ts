// moral stats range from 0-10
export enum MoralDimensions {
  compassion = "compassion", // 0-10 (0 = empathy, 10 = indifference)
  retribution = "retribution", // 0-10 (0 = justice, 10 = forgiveness)
  devotion = "devotion", // 0-10 (0 = loyalty, 10 = integrity)
  dominance = "dominance", // 0-10 (0 = authority, 10 = autonomy)
  purity = "purity", // 0-10 (0 = virtue, 10 = indulgence)
  ego = "ego", // 0-10 (0 = self-sacrificing, 10 = self-serving)
}

export type MoralStatAttribute = "empathetic" | "indifferent" | "integrous" | "just" | "forgiving" | "loyal" | "integrous" | "authoritarian" | "autonomous" | "virtuous" | "indulgent" | "self-serving" | "self-sacrificing";

export const moralStatAttributes = {
  [MoralDimensions.compassion]: {
    low: "empathetic",
    high: "indifferent",
  },
  [MoralDimensions.retribution]: {
    low: "just",
    high: "forgiving",
  },
  [MoralDimensions.devotion]: {
    low: "loyal",
    high: "integrous",
  },
  [MoralDimensions.dominance]: {
    low: "authoritarian",
    high: "autonomous",
  },
  [MoralDimensions.purity]: {
    low: "virtuous",
    high: "indulgent",
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
      if (value > 8 || value < 3) {
        prefix = "++ ";
      } else if (value > 6 || value < 4) {
        prefix = "+ ";
      } else {
        prefix = " ";
      }

      const range = moralStatAttributes[key as MoralDimensions];
      let description: string;
      if (value > 5) {
        description = range.high;
      } else {
        description = range.low;
      }

      acc.push({
        key,
        description: `${!forEvolution ? prefix : ""}${description}`,
        percentage: Math.abs(value - 5) * 20,
      });

      return acc;
    },
    [] as MoralStatsWritten[]
  );

  // sort by intensity value
  return stats.sort((a, b) => b.percentage - a.percentage);
}

export type MoralDimensionsType = Record<MoralDimensions, number>;
