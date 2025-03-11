import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { getUserAndPetId } from "./user";
import { DilemmaTemplate, dilemmaTemplates } from "../constants/dilemmas";
import { getPartitionedDilemmas } from "./lib/getPartitionedDilemmas";

export type GameState = 
  | { status: 'not_authenticated' }
  | { status: 'needs_pet' }
  | {
      status: 'has_dilemmas',
      seenDilemmas: Doc<"dilemmas">[],
      unseenDilemmaTitles: string[],
      pet: Doc<"pets">,
    }
  | {
      status: 'has_unresolved_dilemma',
      seenDilemmas: Doc<"dilemmas">[],
      unresolvedDilemma: DilemmaTemplate,
      question: string,
      pet: Doc<"pets">,
    }
  | {
      status: 'graduated',
      seenDilemmas: Doc<"dilemmas">[],
      pet: Doc<"pets">,
    }

// get an active pet & dilemmas
export const getActiveGameState = query({
  args: {},
  handler: async (ctx): Promise<GameState> => {
    try {
      // add timeout tracking for performance debugging
      const startTime = Date.now();
      
      const { userId, petId } = await getUserAndPetId(ctx);
      console.log(`[getActiveGameState] getUserAndPetId took ${Date.now() - startTime}ms, userId: ${userId ? 'exists' : 'null'}, petId: ${petId ? 'exists' : 'null'}`);
      
      if (!userId) {
        return { status: 'not_authenticated' };
      }
      
      if (!petId) {
        return { status: 'needs_pet' };
      }

      const pet = await ctx.db.get(petId);
      console.log(`[getActiveGameState] pet retrieval took ${Date.now() - startTime}ms, pet: ${pet ? 'exists' : 'null'}`);
      
      if (!pet) {
        return { status: 'needs_pet' };
      }

      // get all dilemmas from db
      const allDilemmas = await ctx.db.query('dilemmas')
        .withIndex('by_userAndPetId', q => q.eq('userId', userId).eq('petId', petId))
        .collect();
      console.log(`[getActiveGameState] dilemmas query took ${Date.now() - startTime}ms, count: ${allDilemmas.length}`);

      const { seenDilemmas, unseenDilemmaTitles, unresolvedDilemma } = getPartitionedDilemmas(allDilemmas);
      console.log(`[getActiveGameState] dilemmas partitioning took ${Date.now() - startTime}ms`);

      // Now determine the game state
      if (pet.age >= 2 || !unseenDilemmaTitles || unseenDilemmaTitles.length === 0) {
        return {
          status: 'graduated',
          seenDilemmas,
          pet,
        } as GameState;
      }

      if (unresolvedDilemma && unresolvedDilemma.outcome) {
        const dilemma = dilemmaTemplates[unresolvedDilemma.title];
        return { 
          status: "has_unresolved_dilemma",
          seenDilemmas,
          unresolvedDilemma: dilemma,
          question: unresolvedDilemma.outcome,
          pet,
        } as GameState;
      }

      return {
        status: 'has_dilemmas',
        seenDilemmas,
        unseenDilemmaTitles,
        pet,
      } as GameState;
    } catch (error) {
      // handle any unexpected errors
      console.error("[getActiveGameState] Unexpected error:", error);
      return { status: 'not_authenticated' };
    }
  },
});

// unused
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
