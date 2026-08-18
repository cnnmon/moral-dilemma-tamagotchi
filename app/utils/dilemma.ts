import { dilemmas } from "@/constants/dilemmas";
import { Pet, ActiveDilemma } from "@/app/storage/pet";
import { MoralDimensionsType } from "@/constants/morals";
import { EvolutionId, getEvolutionTimeFrame } from "@/constants/evolutions";

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

// Predictable priority ordering:
// (1) final-form/graduation dilemma when on the last slot before graduation (age 2)
// (2) conditioned dilemmas whose gate is now open
// (3) random from the unconditioned pool
//
// seenIds uses only *completed* dilemmas so refreshing never buries the current assignment.
export const getRandomUnseenDilemma = (pet: Pet): ActiveDilemma | null => {
  const seenIds = new Set(pet.dilemmas.filter((d) => d.completed).map((d) => d.id));
  const resolvedCount = pet.dilemmas.filter((d) => d.stats).length;

  // (1) graduation — at age 2 the pet is already in its final form, so serve
  // the dilemma written for that form (falling back to the generic one)
  const isLastBeforeGraduation = pet.age === 2 && resolvedCount === getEvolutionTimeFrame(2) - 1;
  if (isLastBeforeGraduation) {
    const finalEvolutionId = pet.evolutionIds[pet.evolutionIds.length - 1];
    const candidateIds = [
      FINAL_EVOLUTION_DILEMMA_BY_EVOLUTION[finalEvolutionId],
      GRADUATION_DILEMMA_ID,
    ];
    for (const id of candidateIds) {
      if (id && !seenIds.has(id)) return makeDilemma(id);
    }
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