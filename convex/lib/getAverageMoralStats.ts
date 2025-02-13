import { MoralDimensionsType } from "../../constants/morals";
import { Doc } from "../_generated/dataModel";

const DEFAULT_AVERAGE_STATS = {
  compassion: 5,
  retribution: 5,
  devotion: 5,
  dominance: 5,
  purity: 5,
  ego: 5,
};

export function getAverageMoralStats(seenDilemmas: Doc<"dilemmas">[]) {
  const moralStats = { ...DEFAULT_AVERAGE_STATS };

  for (const dilemma of seenDilemmas) {
    const updatedMoralStats = dilemma.updatedMoralStats;
    if (!updatedMoralStats) {
      continue;
    }

    // sum all
    for (const key in updatedMoralStats) {
      if (updatedMoralStats.hasOwnProperty(key)) {
        const stat = key as keyof MoralDimensionsType;
        moralStats[stat] += updatedMoralStats[stat];
      }
    }
  }

  // average
  for (const key in moralStats) {
    if (moralStats.hasOwnProperty(key)) {
      const stat = key as keyof MoralDimensionsType;
      moralStats[stat] /= seenDilemmas.length;
    }
  }

  return moralStats;
}

