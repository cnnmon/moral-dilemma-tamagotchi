import { EvolutionId, getEvolution, getEvolutionTimeFrame, stage0Evolutions, Stage1EvolutionId, stage1Evolutions } from "../../constants/evolutions";
import { MoralDimensionsType, MoralStatAttribute, getMoralStatsWritten } from "../../constants/morals";
import { Doc } from "../_generated/dataModel";

function evolveFromBabyToStage1(moralStatsWritten: { key: string; description: string; percentage: number }[]): EvolutionId {
  for (const attribute of moralStatsWritten) {
    const currentEvolution = stage0Evolutions.baby;
    const nextEvolution = currentEvolution.nextStages?.[attribute.description as MoralStatAttribute];
    if (nextEvolution) {
      return nextEvolution;
    }
  }
  return "npc";
}

function evolveFromStage1ToStage2(currentEvolutionId: Stage1EvolutionId, moralStatsWritten: { key: string; description: string; percentage: number }[]): EvolutionId {
  const currentEvolution = stage1Evolutions[currentEvolutionId];
  for (const attribute of moralStatsWritten) {
    const nextEvolution = currentEvolution.nextStages?.[attribute.description as MoralStatAttribute];
    if (nextEvolution) {
      return nextEvolution;
    }
  }
  return "npc";
}

export function evolvePetIfNeeded(seenDilemmasCount: number, pet: Doc<"pets">, averageMoralStats: MoralDimensionsType): Doc<"pets"> | undefined {
  const timeFrame = getEvolutionTimeFrame(pet.age);
  console.log("🐦 timeFrame vs seenDilemmasCount", timeFrame, seenDilemmasCount);
  if (seenDilemmasCount < timeFrame) {
    return;
  }

  const currentEvolution = getEvolution(pet.evolutionId as EvolutionId);
  const moralStatsWritten = getMoralStatsWritten(averageMoralStats, true);
  console.log("🐦 moralStatsWritten", JSON.stringify(moralStatsWritten));

  let newEvolutionId: EvolutionId | undefined;
  switch (pet.age) {
    case 0:
      newEvolutionId = evolveFromBabyToStage1(moralStatsWritten);
      console.log("🐦 stage 0 newEvolutionId", newEvolutionId);
      break;
    case 1:
      newEvolutionId = evolveFromStage1ToStage2(currentEvolution.id as Stage1EvolutionId, moralStatsWritten);
      console.log("🐦 stage 1 newEvolutionId", newEvolutionId);
      break;
    case 2:
      console.log("🐦 stage 2 graduated", true);
      return {
        ...pet,
        graduated: true,
      }
    default:
      throw new Error(`Unexpected age value of ${pet.age}`);
  }

  if (!newEvolutionId) {
    throw new Error(`No evolution determined for ${pet.evolutionId} at age ${pet.age}`);
  }

  return {
    ...pet,
    evolutionId: newEvolutionId,
    age: pet.age + 1,
  }
}