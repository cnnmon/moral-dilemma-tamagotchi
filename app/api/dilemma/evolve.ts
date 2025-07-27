import { EvolutionId, getEvolutionTimeFrame } from "@/constants/evolutions";
import { DEFAULT_AVERAGE_STATS, MoralDimensionsType, getMoralStatsWritten } from "@/constants/morals";
import { ActiveDilemma, Pet } from "@/app/storage/pet";

// Add evolution functions adapted for local storage
export function getAverageMoralStats(
  dilemmas: ActiveDilemma[]
): MoralDimensionsType {
  const moralStats = {
    compassion: 0,
    retribution: 0,
    devotion: 0,
    dominance: 0,
    purity: 0,
    ego: 0
  };
  const statCounts = {
    compassion: 0,
    retribution: 0, 
    devotion: 0,
    dominance: 0,
    purity: 0,
    ego: 0
  };

  for (const dilemma of dilemmas) {
    const stats = dilemma.stats;
    if (!stats) continue;

    // Sum all values (including defaults)
    for (const key of Object.keys(stats)) {
      const value = stats[key as keyof MoralDimensionsType];
      moralStats[key as keyof MoralDimensionsType] += value;
      statCounts[key as keyof MoralDimensionsType]++;
    }
  }

  // Calculate averages, defaulting to 5 if no dilemmas have affected that stat
  const result = { ...DEFAULT_AVERAGE_STATS };
  for (const key of Object.keys(moralStats)) {
    const statKey = key as keyof MoralDimensionsType;
    if (statCounts[statKey] > 0) {
      result[statKey] = moralStats[statKey] / statCounts[statKey];
    }
  }

  return result;
}

function evolveFromBabyToStage1(
  moralStatsWritten: { key: string; description: string; percentage: number }[]
): EvolutionId {
  // Simple evolution logic based on dominant moral trait
  for (const attribute of moralStatsWritten) {
    switch (attribute.description) {
      case "highly emotional":
      case "moderately emotional":
        return EvolutionId.EMPATH;
      case "highly virtuous":
      case "moderately virtuous":
        return EvolutionId.DEVOUT;
      case "highly punishing":
      case "moderately punishing":
        return EvolutionId.WATCHER;
      case "highly authoritarian":
      case "moderately authoritarian":
        return EvolutionId.SOLDIER;
      case "highly loyal":
      case "moderately loyal":
        return EvolutionId.TEACHERSPET;
      case "highly self-serving":
      case "moderately self-serving":
        return EvolutionId.HEDONIST;
    }
  }
  return EvolutionId.NPC;
}

function evolveFromStage1ToStage2(
  currentEvolutionId: EvolutionId,
  moralStatsWritten: { key: string; description: string; percentage: number }[]
): EvolutionId {
  // Stage 2 evolution based on current evolution + dominant traits
  const dominantTrait = moralStatsWritten[0]?.description;
  
  switch (currentEvolutionId) {
    case EvolutionId.WATCHER:
      return dominantTrait?.includes("authoritarian") ? EvolutionId.GAVEL : EvolutionId.VIGILANTE;
    case EvolutionId.SOLDIER:
      return dominantTrait?.includes("self-serving") ? EvolutionId.GODFATHER : EvolutionId.GUARDIAN;
    case EvolutionId.TEACHERSPET:
      return dominantTrait?.includes("indulgent") ? EvolutionId.ARISTOCRAT : EvolutionId.SAINT;
    case EvolutionId.HEDONIST:
      return dominantTrait?.includes("logical") ? EvolutionId.SIGMA : EvolutionId.CULTLEADER;
    case EvolutionId.EMPATH:
      return EvolutionId.SAINT;
    case EvolutionId.DEVOUT:
      return EvolutionId.CULTLEADER;
    default:
      return EvolutionId.GRADUATED;
  }
}

export function evolvePetIfNeeded(
  resolvedDilemmasCount: number,
  pet: Pet,
  averageMoralStats: MoralDimensionsType
): { evolutionId: EvolutionId; age: number } | undefined {
  const timeFrame = getEvolutionTimeFrame(pet.age);
  if (resolvedDilemmasCount < timeFrame) {
    return;
  }

  const currentEvolutionId = pet.evolutionIds?.[pet.evolutionIds.length - 1] || EvolutionId.BABY;
  const moralStatsWritten = getMoralStatsWritten(averageMoralStats);
  console.log("🐦 moralStatsWritten", JSON.stringify(moralStatsWritten));

  let newEvolutionId: EvolutionId | undefined;
  if (pet.age === 0) {
    newEvolutionId = evolveFromBabyToStage1(moralStatsWritten);
    console.log("🐦 stage 0 newEvolutionId", newEvolutionId);
  } else if (pet.age === 1) {
    newEvolutionId = evolveFromStage1ToStage2(currentEvolutionId as EvolutionId, moralStatsWritten);
    console.log("🐦 stage 1 newEvolutionId", newEvolutionId);
  } else {
    return;
  }

  if (!newEvolutionId) {
    throw new Error(
      `No evolution determined for ${currentEvolutionId} at age ${pet.age}`
    );
  }

  return {
    evolutionId: newEvolutionId,
    age: pet.age + 1,
  };
}