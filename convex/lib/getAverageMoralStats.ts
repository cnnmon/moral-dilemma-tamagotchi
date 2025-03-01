import { MoralDimensionsType } from "../../constants/morals";
import { Doc } from "../_generated/dataModel";

export function getAverageMoralStats(seenDilemmas: Doc<"dilemmas">[], newMoralStats: MoralDimensionsType): MoralDimensionsType {
  const moralStats = { ...newMoralStats };
  const statCounts = {
    compassion: 1,
    retribution: 1, 
    devotion: 1,
    dominance: 1,
    purity: 1,
    ego: 1
  };

  for (const dilemma of seenDilemmas) {
    const updatedMoralStats = dilemma.updatedMoralStats;
    if (!updatedMoralStats) {
      continue;
    }

    // sum all
    for (const key of Object.keys(updatedMoralStats)) {
      const value = updatedMoralStats[key as keyof MoralDimensionsType];
      if (value === 5) {
        continue;
      }

      moralStats[key as keyof MoralDimensionsType] += value;
      statCounts[key as keyof MoralDimensionsType]++;
    }
  }

  // average
  for (const key of Object.keys(moralStats)) {
    moralStats[key as keyof MoralDimensionsType] /= statCounts[key as keyof MoralDimensionsType];
  }

  return moralStats;
}
