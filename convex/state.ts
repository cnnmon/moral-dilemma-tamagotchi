import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { getUserAndPetId } from "./user";
import { DilemmaTemplate, dilemmaTemplates } from "../constants/dilemmas";
import { getPartitionedDilemmas } from "./lib/getPartitionedDilemmas";
import { evolvePetIfNeeded } from "./lib/evolvePetIfNeeded";

export type GameState = 
  | { status: 'not_authenticated' }
  | { status: 'needs_pet' }
  | {
      status: 'has_dilemmas',
      seenDilemmas: Doc<"dilemmas">[],
      unseenDilemmaTitles: string[],
      pet: Doc<"pets">
    }
  | {
      status: 'out_of_dilemmas',
      seenDilemmas: Doc<"dilemmas">[],
      pet: Doc<"pets">
    }
  | {
      status: 'has_unresolved_dilemma',
      seenDilemmas: Doc<"dilemmas">[],
      unresolvedDilemma: DilemmaTemplate,
      question: string,
      pet: Doc<"pets">
    }

// get an active pet & dilemmas
export const getActiveGameState = query({
  args: {},
  handler: async (ctx): Promise<GameState> => {
    const { userId, petId } = await getUserAndPetId(ctx);
    
    if (!userId) {
      return { status: 'not_authenticated' };
    }
    
    if (!petId) {
      return { status: 'needs_pet' };
    }

    const pet = await ctx.db.get(petId);
    if (!pet) {
      return { status: 'needs_pet' };
    }

    // get all dilemmas from db
    const allDilemmas = await ctx.db.query('dilemmas')
      .withIndex('by_userAndPetId', q => q.eq('userId', userId).eq('petId', petId))
      .collect();

    const { seenDilemmas, unseenDilemmaTitles, unresolvedDilemma } = getPartitionedDilemmas(allDilemmas);

    if (unresolvedDilemma && unresolvedDilemma.outcome) {
      const dilemma = dilemmaTemplates[unresolvedDilemma.title];
      return { 
        status: "has_unresolved_dilemma",
        seenDilemmas,
        unresolvedDilemma: dilemma,
        question: unresolvedDilemma.outcome,
        pet,
      };
    }
    
    if (!unseenDilemmaTitles || unseenDilemmaTitles.length === 0) {
      return { 
        status: 'out_of_dilemmas',
        seenDilemmas,
        pet
      };
    }

    // evolve if # of dilemmas have been met
    const evolution = evolvePetIfNeeded(seenDilemmas.length, pet);
    if (evolution) {
      await ctx.db.update(petId, { evolutionId: evolution.evolutionId, age: evolution.age });
    }
    
    return {
      status: 'has_dilemmas',
      seenDilemmas,
      unseenDilemmaTitles,
      pet,
    };
  },
});

export const resetGame = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId, petId } = await getUserAndPetId(ctx);
    if (!userId || !petId) {
      return;
    }

    // await all dilemmas that involve this petId
    const dilemmas = await ctx.db.query('dilemmas')
      .withIndex('by_userAndPetId', q => q.eq('userId', userId).eq('petId', petId))
      .collect();

    // delete all dilemmas
    for (const dilemma of dilemmas) {
      await ctx.db.delete(dilemma._id);
    }

    // then delete the pet
    await ctx.db.delete(petId);
  },
});
