// Simulates full playthroughs against the real game logic and asserts every
// pet gets a normal graduation: stage 1 at 4 dilemmas, stage 2 (final form)
// at 7, the special final-form/graduation dilemma served as the 9th, and
// graduation (age 3) after 9 resolved dilemmas.
//
// Run with: npx tsx tests/graduation.test.ts

import assert from "node:assert";
import {
  evolvePetIfNeeded,
  getAverageMoralStats,
} from "../app/api/dilemma/evolve";
import { getRandomUnseenDilemma } from "../app/utils/dilemma";
import { getPrompt } from "../app/api/dilemma/prompt";
import { EvolutionId, getEvolutionTimeFrame } from "../constants/evolutions";
import type { Pet } from "../app/storage/pet";

const FINAL_DILEMMA_IDS = new Set([
  "judgeconscience",
  "snoopexpose",
  "walkaway",
  "quietsabotage",
  "birthdayevent",
  "worstjob",
  "fabricatedaward",
  "wrongallalongalpha",
  "graduation",
]);

function makePet(): Pet {
  return {
    id: "test",
    name: "birb",
    age: 0,
    evolutionIds: [EvolutionId.BABY],
    personality: "",
    baseStats: { health: 5, hunger: 5, happiness: 5, sanity: 5 },
    moralStats: { compassion: 5, retribution: 5, devotion: 5, dominance: 5, purity: 5, ego: 5 },
    dilemmas: [],
  };
}

type AdviceStats = Partial<Pet["moralStats"]>;

// Mirrors the resolution flow in route.ts + useDilemmaSubmit for one dilemma.
function playOneDilemma(pet: Pet, adviceStats: AdviceStats): string {
  const next = getRandomUnseenDilemma(pet);
  assert(next, `a dilemma should be served (age ${pet.age}, ${pet.dilemmas.length} played)`);

  // the model only returns changed stats, so fill the rest with neutral 5s
  const resolved = {
    ...next,
    stats: { ...makePet().moralStats, ...adviceStats },
    completed: true,
  };
  const resolvedBefore = pet.dilemmas.filter((d) => d.stats);
  const averageMoralStats = getAverageMoralStats([...resolvedBefore, resolved]);
  const evolution = evolvePetIfNeeded(resolvedBefore.length + 1, pet, averageMoralStats);

  pet.dilemmas.push(resolved);
  pet.moralStats = averageMoralStats;
  if (evolution) {
    if (evolution.evolutionId) pet.evolutionIds.push(evolution.evolutionId);
    pet.age = evolution.age;
  }
  return next.id;
}

function simulatePlaythrough(label: string, adviceStats: AdviceStats) {
  const pet = makePet();
  const servedIds: string[] = [];

  for (let step = 1; step <= 9; step++) {
    servedIds.push(playOneDilemma(pet, adviceStats));

    const resolvedCount = pet.dilemmas.filter((d) => d.stats).length;
    if (resolvedCount === getEvolutionTimeFrame(0)) {
      assert.equal(pet.age >= 1, true, `${label}: stage 1 evolution after 4 dilemmas`);
      assert.equal(pet.evolutionIds.length, 2, `${label}: stage 1 form added`);
    }
    if (resolvedCount === getEvolutionTimeFrame(1)) {
      assert.equal(pet.age, 2, `${label}: final (stage 2) evolution after 7 dilemmas`);
      assert.equal(pet.evolutionIds.length, 3, `${label}: stage 2 form added`);
    }
  }

  // 9th dilemma must be the final-form or generic graduation dilemma
  const ninthId = servedIds[8];
  assert(
    FINAL_DILEMMA_IDS.has(ninthId),
    `${label}: 9th dilemma should be a final/graduation dilemma, got "${ninthId}"`
  );

  // graduation: age 3, no extra evolution id, and the prompt switches modes
  assert.equal(pet.age, 3, `${label}: graduated (age 3) after 9 dilemmas`);
  assert.equal(pet.evolutionIds.length, 3, `${label}: graduation adds no new form`);

  const prompt = getPrompt(pet, { id: "x", messages: [], completed: false });
  assert(
    prompt.includes("you have graduated"),
    `${label}: graduated pets get the button-only self-answer prompt`
  );

  console.log(`  ✅ ${label}: ${pet.evolutionIds.join(" → ")} → graduated (9th: ${ninthId})`);
}

console.log("simulating playthroughs...");

// different moral profiles to cover different evolution paths
simulatePlaythrough("saint path (emotional + loyal)", { compassion: 9, devotion: 9 });
simulatePlaythrough("sigma path (self-serving + logical)", { ego: 9, compassion: 1 });
simulatePlaythrough("gavel path (punishing + authoritarian)", { retribution: 9, dominance: 9 });
simulatePlaythrough("npc path (neutral advice)", { compassion: 5, ego: 5 });

// fallback: if the final-form dilemma was already completed earlier, the
// generic graduation dilemma is served instead
{
  const pet = makePet();
  for (let step = 1; step <= 8; step++) playOneDilemma(pet, { retribution: 9, dominance: 9 });
  assert.equal(pet.age, 2, "fallback: at stage 2 before last dilemma");
  const finalForm = pet.evolutionIds[pet.evolutionIds.length - 1];
  // pretend the pet already saw its final-form dilemma
  const finalDilemmaId = { gavel: "judgeconscience", vigilante: "snoopexpose" }[finalForm as string];
  assert(finalDilemmaId, `fallback: expected gavel/vigilante, got ${finalForm}`);
  pet.dilemmas.push({ id: finalDilemmaId, messages: [], completed: true });

  const ninth = getRandomUnseenDilemma(pet);
  assert.equal(ninth?.id, "graduation", "fallback: generic graduation dilemma served");
  console.log(`  ✅ fallback: seen final-form dilemma falls back to "graduation"`);
}

console.log("\nall graduation tests passed");
