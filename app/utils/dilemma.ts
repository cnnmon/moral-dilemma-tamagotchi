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

// get a random unseen dilemma; reserves the graduation dilemma for the final slot before age-2 evolution
export const getRandomUnseenDilemma = (pet: Pet): ActiveDilemma | null => {
  const seenIds = new Set(pet.dilemmas.map((d) => d.id));
  const currentEvolutionId = pet.evolutionIds[pet.evolutionIds.length - 1];
  const finalEvolutionDilemmaId = FINAL_EVOLUTION_DILEMMA_BY_EVOLUTION[currentEvolutionId];

  // force graduation dilemma on the last pick before stage-1 → stage-2 evolution
  const resolvedCount = pet.dilemmas.filter((d) => d.stats).length;
  const isLastBeforeGraduation =
    pet.age === 1 && resolvedCount === getEvolutionTimeFrame(1) - 1;

  if (isLastBeforeGraduation && !seenIds.has(GRADUATION_DILEMMA_ID)) {
    return makeDilemma(GRADUATION_DILEMMA_ID);
  }

  // Show each final-form stress-test only after the pet reaches its final evolution.
  if (pet.age >= 2 && finalEvolutionDilemmaId && !seenIds.has(finalEvolutionDilemmaId)) {
    return makeDilemma(finalEvolutionDilemmaId);
  }

  const pool = Object.keys(dilemmas).filter(
    (id) =>
      !seenIds.has(id) &&
      id !== GRADUATION_DILEMMA_ID &&
      !FINAL_EVOLUTION_DILEMMA_IDS.has(id)
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