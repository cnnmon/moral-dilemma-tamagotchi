import {
  EvolutionId,
  getEvolution,
  getEvolutionTimeFrame,
  Stage1EvolutionId,
  stage1Evolutions,
  stage1EvolutionsByAttribute,
  Stage2EvolutionId,
  stage2Evolutions,
} from "../../constants/evolutions";
import { MoralDimensions } from "../../constants/morals";
import { Doc } from "../_generated/dataModel";

function nearestIntensity(value: number): number {
  return value >= 5 ? 10 : 0;
}

function evolveFromBabyToStage1(
  moralStatsSorted: [string, number][]
): Stage1EvolutionId {
  // an evolution exists for each attribute from baby -> stage 1
  // so we can just iterate through highest attribute and find most fitting evolution
  for (const [attribute, value] of moralStatsSorted) {
    const closestValue = nearestIntensity(value);
    const evolutionId = stage1EvolutionsByAttribute[attribute as MoralDimensions];

    // check if the pet's attribute matches intensity (0 or 10)
    if (stage1Evolutions[evolutionId].requirements[attribute as MoralDimensions] === closestValue) {
      return evolutionId;
    }
  }

  throw new Error(`No evolution determined for baby given ${JSON.stringify(moralStatsSorted)}`);
}

function evolveFromStage1ToStage2(
  currentEvolutionId: Stage1EvolutionId,
  moralStatsSorted: [string, number][]
): Stage2EvolutionId {
  // given a current evolution, we must determine stage 2 evolution from one of 2 options
  // the options are TYPICALLY opposites of one another (e.g. compassion 10 or compassion 0)
  const currentEvolution = stage1Evolutions[currentEvolutionId];
  const [evolutionAId, evolutionBId] = currentEvolution.nextStages;
  const evolutionA = stage2Evolutions[evolutionAId];
  const evolutionB = stage2Evolutions[evolutionBId];
  const attributeA = evolutionA.requirements;
  const attributeB = evolutionB.requirements;

  if (attributeA !== attributeB) {
    // catch special case where attributes between both evolutions are different
    // ex. sigma -> hedonist (indulgence) or npc (indifference)
    // check which attribute is higher in the sorted moral stats list
    const attributeAValue = moralStatsSorted.find(([attribute]) => attribute === attributeA);
    const attributeBValue = moralStatsSorted.find(([attribute]) => attribute === attributeB);
    // TODO: check which attribute is higher intensity (0 or 10) and matches in the sorted moral stats list
    return attributeAValue[1] > attributeBValue[1] ? evolutionAId : evolutionBId;
  }

  // TODO: check which evolution is most fitting
  const attributeValue = moralStatsSorted.find(([attribute]) => attribute === attributeA);
  if (!attributeValue) {
    throw new Error(`No attribute value found for ${attributeA}`);
  }
  const closestValue = nearestIntensity(attributeValue[1]);
  if (evolutionA.requirements[attributeA] === closestValue) {
    return evolutionAId;
  } else if (evolutionB.requirements[attributeB] === closestValue) {
    return evolutionBId;
  }

  throw new Error(`No evolution determined for ${highestAttributeName}`);
}

export function evolvePetIfNeeded(
  seenDilemmasCount: number,
  pet: Doc<"pets">
): Doc<"pets"> | undefined {
  // check if pet has seen enough dilemmas for its age
  const timeFrame = getEvolutionTimeFrame(pet.age);
  if (seenDilemmasCount < timeFrame) {
    // still evolving!
    return;
  }

  // evolve! check current evolution & sort moral stats by highest
  const currentEvolution = getEvolution(pet.evolutionId as EvolutionId);
  const moralStatsSorted = Object.entries(pet.moralStats).sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  );
  console.log(moralStatsSorted);

  let newEvolutionId: EvolutionId | undefined;
  switch (pet.age) {
    case 0: // baby
      newEvolutionId = evolveFromBabyToStage1(moralStatsSorted);
      break;
    case 1: // adolescent
      newEvolutionId = evolveFromStage1ToStage2(
        currentEvolution.id as Stage1EvolutionId,
        moralStatsSorted
      );
      break;
    case 2: // mature -> no more evolutions
      return pet;
    default:
      throw new Error(`Unexpected age value of ${pet.age}`);
  }

  if (!newEvolutionId) {
    throw new Error(
      `No evolution determined for ${pet.evolutionId} at age ${pet.age}`
    );
  }

  return {
    ...pet,
    evolutionId: newEvolutionId,
    age: pet.age + 1,
  };
}
