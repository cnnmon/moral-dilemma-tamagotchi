import { EvolutionId, getEvolutionTimeFrame } from "@/constants/evolutions";
import { DEFAULT_AVERAGE_STATS, MoralDimensionsType, getMoralStatsWritten } from "@/constants/morals";
import { ActiveDilemma, Pet } from "@/app/storage/pet";

// Add evolution functions adapted for local storage
export function getAverageMoralStats(
  dilemmas: ActiveDilemma[]
): MoralDimensionsType {
  const moralStats = {
    compassion: 5,
    retribution: 5,
    devotion: 5,
    dominance: 5,
    purity: 5,
    ego: 5
  };
  const statCounts = {
    compassion: 1,
    retribution: 1, 
    devotion: 1,
    dominance: 1,
    purity: 1,
    ego: 1
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
  moralStatsWritten: { key: string; description: string; percentage: number; value: number }[]
): EvolutionId {
  // each branch checks its own determining stat directly, not just the overall dominant trait
  const stat = (key: string) => moralStatsWritten.find((s) => s.key === key)?.value ?? 5;

  switch (currentEvolutionId) {
    case EvolutionId.WATCHER:    // retribution: dominance high → gavel, low → vigilante
      return stat("dominance") > 5 ? EvolutionId.GAVEL : EvolutionId.VIGILANTE;
    case EvolutionId.SOLDIER:    // devotion: ego high → godfather, low → guardian
      return stat("ego") > 5 ? EvolutionId.GODFATHER : EvolutionId.GUARDIAN;
    case EvolutionId.TEACHERSPET: // dominance: purity high → saint, low → aristocrat
      return stat("purity") > 5 ? EvolutionId.SAINT : EvolutionId.ARISTOCRAT;
    case EvolutionId.HEDONIST:   // ego: compassion low → sigma, high → cultleader
      return stat("compassion") > 5 ? EvolutionId.CULTLEADER : EvolutionId.SIGMA;
    case EvolutionId.EMPATH:     // compassion: devotion high → saint, low → cultleader
      return stat("devotion") > 5 ? EvolutionId.SAINT : EvolutionId.CULTLEADER;
    case EvolutionId.DEVOUT:     // purity: retribution high → gavel, low → saint
      return stat("retribution") > 5 ? EvolutionId.GAVEL : EvolutionId.SAINT;
    case EvolutionId.NPC:        // fallback: compassion high → guardian, low → sigma
      return stat("compassion") > 5 ? EvolutionId.GUARDIAN : EvolutionId.SIGMA;
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