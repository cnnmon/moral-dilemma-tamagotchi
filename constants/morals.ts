// moral stats range from 0-10
export enum MoralDimensions {
  compassion = "compassion", // 0-10 (0 = empathy, 10 = indifference)
  retribution = "retribution", // 0-10 (0 = justice, 10 = forgiveness)
  devotion = "devotion", // 0-10 (0 = loyalty, 10 = integrity)
  dominance = "dominance", // 0-10 (0 = authority, 10 = autonomy)
  purity = "purity", // 0-10 (0 = virtue, 10 = indulgence)
  ego = "ego", // 0-10 (0 = self-sacrificing, 10 = self-serving)
}

export const moralStatsDescriptions = {
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
    low: "authoritative",
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
  moralStats: MoralDimensionsType
): MoralStatsWritten[] {
  const stats = Object.entries(moralStats).reduce(
    (acc, [key, value]) => {
      if (value === 5) {
        return acc;
      }

      let prefix: string;
      if (value > 8 || value < 3) {
        prefix = "+++";
      } else if (value > 6 || value < 4) {
        prefix = "++";
      } else {
        prefix = "+";
      }

      const range = moralStatsDescriptions[key as MoralDimensions];
      let description: string;
      if (value > 5) {
        description = range.high;
      } else {
        description = range.low;
      }

      acc.push({
        key,
        description: `${prefix} ${description}`,
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
