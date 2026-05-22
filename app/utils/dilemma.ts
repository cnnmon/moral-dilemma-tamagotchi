import { dilemmas } from "@/constants/dilemmas";
import { Pet, ActiveDilemma } from "@/app/storage/pet";
import { MoralDimensionsType } from "@/constants/morals";
import { EvolutionId, getEvolutionTimeFrame } from "@/constants/evolutions";
import { getAverageMoralStats } from "@/app/api/dilemma/evolve";
import { getMoralStatsWritten } from "@/constants/morals";

const GRADUATION_DILEMMA_ID = "graduation";
const FINAL_EVOLUTION_DILEMMA_BY_EVOLUTION: Partial<Record<EvolutionId, string>> = {
  [EvolutionId.GAVEL]: "judgeconscience",
  [EvolutionId.VIGILANTE]: "snoopexpose",
  [EvolutionId.GODFATHER]: "walkaway",
  [EvolutionId.GUARDIAN]: "quietsabotage",
  [EvolutionId.ARISTOCRAT]: "birthdayevent",
  [EvolutionId.SIGMA]: "worstjob",
  [EvolutionId.SAINT]: "fabricatedaward",
  [EvolutionId.CULTLEADER]: "wrongallalongalpha",
};
const FINAL_EVOLUTION_DILEMMA_IDS = new Set(
  Object.values(FINAL_EVOLUTION_DILEMMA_BY_EVOLUTION)
);

const makeDilemma = (id: string): ActiveDilemma => ({
  id,
  messages: [],
  completed: false,
});

function getProjectedFinalEvolutionId(pet: Pet): EvolutionId | undefined {
  const currentEvolutionId = pet.evolutionIds[pet.evolutionIds.length - 1];

  // already in final-form stage; use that form directly
  if (pet.age >= 2) {
    return currentEvolutionId;
  }

  // before final-form stage, project where this pet would evolve right now
  if (pet.age !== 1) {
    return;
  }

  const moralStatsWritten = getMoralStatsWritten(getAverageMoralStats(pet.dilemmas));
  const stat = (key: string) => moralStatsWritten.find((s) => s.key === key)?.value ?? 5;

  switch (currentEvolutionId) {
    case EvolutionId.WATCHER:
      return stat("dominance") > 5 ? EvolutionId.GAVEL : EvolutionId.VIGILANTE;
    case EvolutionId.SOLDIER:
      return stat("ego") > 5 ? EvolutionId.GODFATHER : EvolutionId.GUARDIAN;
    case EvolutionId.TEACHERSPET:
      return stat("purity") > 5 ? EvolutionId.SAINT : EvolutionId.ARISTOCRAT;
    case EvolutionId.HEDONIST:
      return stat("compassion") > 5 ? EvolutionId.CULTLEADER : EvolutionId.SIGMA;
    case EvolutionId.EMPATH:
      return stat("devotion") > 5 ? EvolutionId.SAINT : EvolutionId.CULTLEADER;
    case EvolutionId.DEVOUT:
      return stat("retribution") > 5 ? EvolutionId.GAVEL : EvolutionId.SAINT;
    case EvolutionId.NPC:
      return stat("compassion") > 5 ? EvolutionId.GUARDIAN : EvolutionId.SIGMA;
    default:
      return;
  }
}

// Predictable priority ordering:
// (1) graduation/final dilemma when on the last slot before stage 2
// (2) conditioned dilemmas whose gate is now open
// (3) random from the unconditioned pool
//
// seenIds uses only *completed* dilemmas so refreshing never buries the current assignment.
export const getRandomUnseenDilemma = (pet: Pet): ActiveDilemma | null => {
  const seenIds = new Set(pet.dilemmas.filter((d) => d.completed).map((d) => d.id));
  const resolvedCount = pet.dilemmas.filter((d) => d.stats).length;

  // (1) graduation
  const isLastBeforeGraduation = pet.age === 1 && resolvedCount === getEvolutionTimeFrame(1) - 1;
  if (isLastBeforeGraduation) {
    const projectedFinalEvolutionId = getProjectedFinalEvolutionId(pet);
    const graduationDilemmaId =
      (projectedFinalEvolutionId
        ? FINAL_EVOLUTION_DILEMMA_BY_EVOLUTION[projectedFinalEvolutionId]
        : undefined) ?? GRADUATION_DILEMMA_ID;
    if (!seenIds.has(graduationDilemmaId)) return makeDilemma(graduationDilemmaId);
  }

  const isEligible = (id: string) =>
    !seenIds.has(id) && id !== GRADUATION_DILEMMA_ID && !FINAL_EVOLUTION_DILEMMA_IDS.has(id);

  const pool = Object.keys(dilemmas).filter(
    (id) => isEligible(id) && (!dilemmas[id].condition || dilemmas[id].condition?.(pet.moralStats))
  );
  if (pool.length === 0) return null;
  return makeDilemma(pool[Math.floor(Math.random() * pool.length)]);
};

// Format moral stats changes for display
export const formatMoralStatsChange = (oldStats: MoralDimensionsType, newStats: MoralDimensionsType): string[] => {
  const changes: string[] = [];
  
  Object.entries(newStats).forEach(([key, newValue]) => {
    const oldValue = oldStats[key as keyof MoralDimensionsType];
    const diff = newValue - oldValue;
    
    if (Math.abs(diff) > 0.01) { // Only show significant changes
      const sign = diff > 0 ? "+" : "-";
      changes.push(`${sign}${key}`);
    }
  });
  
  return changes;
}; 