// moral stats range from 0-10
export enum MoralDimensions {
  compassion = "compassion", 
  retribution = "retribution",
  devotion = "devotion",
  dominance = "dominance",
  purity = "purity",
  ego = "ego",
}

export const DEFAULT_AVERAGE_STATS: MoralDimensionsType = {
  compassion: 5,
  retribution: 5,
  devotion: 5,
  dominance: 5,
  purity: 5,
  ego: 5,
};

export type MoralStatAttribute =
  | "logical"
  | "emotional"
  | "forgiving"
  | "punishing"
  | "personally integrous"
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
    low: "personally integrous",
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

export function parseMoralStats(moralStats: MoralDimensionsType): MoralStatsWritten[] {
  return Object.entries(moralStats).reduce((acc, [key, value]) => {
    const range = attributes[key as MoralDimensions];
    const description = value > 5 ? range.high : range.low;
    acc.push({
      key,
      description,
      percentage: Math.abs(value - 5) * 20,
      value
    });
    return acc;
  }, [] as MoralStatsWritten[]);
}

export function getMoralStatsWritten(
  moralStats: MoralDimensionsType,
): MoralStatsWritten[] {
  const moralStatsParsed = parseMoralStats(moralStats);
  
  // filter and format the stats
  const stats = moralStatsParsed.reduce(
    (acc, stat) => {
      let prefix = "";
      if (stat.value > 7 || stat.value < 3) {
        prefix = "highly ";
      } else if (stat.value > 6 || stat.value < 4) {
        prefix = "moderately ";
      } else if (stat.value === 5) {
        prefix = "";
      }

      acc.push({
        key: stat.key,
        description: `${prefix}${stat.description}`,
        percentage: stat.percentage,
        value: stat.value,
      });

      return acc;
    },
    [] as MoralStatsWritten[]
  );

  // sort by intensity value
  return stats.sort((a, b) => Math.abs(b.value - 5) - Math.abs(a.value - 5));
}

export type MoralDimensionsType = Record<MoralDimensions, number>;
