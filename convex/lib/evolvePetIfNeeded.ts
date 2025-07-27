import {
  EvolutionId,
  getEvolution,
  getEvolutionTimeFrame,
  stage0Evolutions,
  Stage1EvolutionId,
  stage1Evolutions,
} from "../../constants/evolutions";
import {
  MoralDimensionsType,
  MoralStatAttribute,
  getMoralStatsWritten,
} from "../../constants/morals";
import { Doc } from "../_generated/dataModel";

function evolveFromBabyToStage1(
  moralStatsWritten: { key: string; description: string; percentage: number }[]
): EvolutionId {
  for (const attribute of moralStatsWritten) {
    const currentEvolution = stage0Evolutions.baby;
    const nextEvolution =
      currentEvolution.nextStages?.[
        attribute.description as MoralStatAttribute
      ];
    if (nextEvolution) {
      return nextEvolution;
    }
  }
  return EvolutionId.NPC;
}

function evolveFromStage1ToStage2(
  currentEvolutionId: Stage1EvolutionId,
  moralStatsWritten: { key: string; description: string; percentage: number }[]
): EvolutionId {
  const currentEvolution = stage1Evolutions[currentEvolutionId];
  for (const attribute of moralStatsWritten) {
    const nextEvolution =
      currentEvolution.nextStages?.[
        attribute.description as MoralStatAttribute
      ];
    if (nextEvolution) {
      return nextEvolution as EvolutionId;
    }
  }
  return EvolutionId.NPC;
}

export function evolvePetIfNeeded(
  seenDilemmasCount: number,
  pet: Doc<"pets">,
  averageMoralStats: MoralDimensionsType
):
  | { evolutionId: EvolutionId; age: number; }
  | undefined {
  const timeFrame = getEvolutionTimeFrame(pet.age);
  if (seenDilemmasCount < timeFrame) {
    return;
  }

  const currentEvolution = getEvolution(pet.evolutionId as EvolutionId);
  const moralStatsWritten = getMoralStatsWritten(averageMoralStats);
  console.log("🐦 moralStatsWritten", JSON.stringify(moralStatsWritten));

  let newEvolutionId: EvolutionId | undefined;
  if (pet.age === 0) {
    newEvolutionId = evolveFromBabyToStage1(moralStatsWritten);
    console.log("🐦 stage 0 newEvolutionId", newEvolutionId);
  } else if (pet.age === 1) {
    newEvolutionId = evolveFromStage1ToStage2(
      currentEvolution.id as Stage1EvolutionId,
      moralStatsWritten
    );
    console.log("🐦 stage 1 newEvolutionId", newEvolutionId);
  } else {
    return;
  }

  if (!newEvolutionId) {
    throw new Error(
      `No evolution determined for ${pet.evolutionId} at age ${pet.age}`
    );
  }

  return {
    evolutionId: newEvolutionId,
    age: pet.age + 1,
  };
}
