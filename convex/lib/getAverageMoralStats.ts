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
    for (const key of Object.keys(updatedMoralStats)) {
      moralStats[key as keyof MoralDimensionsType] += updatedMoralStats[key as keyof MoralDimensionsType];
    }
  }

  // average
  for (const key of Object.keys(moralStats)) {
    moralStats[key as keyof MoralDimensionsType] /= (seenDilemmas.length + 1);
  }

  console.log("moralStats", moralStats);

  return moralStats;
}

