import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { getUserAndPetId } from "./user";
import { dilemmaTemplates } from "../constants/dilemmas";
import { getPartitionedDilemmas } from "./lib/getPartitionedDilemmas";

export type GameState = 
  | { status: 'not_authenticated' }
  | { status: 'needs_pet' }
  | {
      status: 'has_dilemmas',
      pet: Doc<"pets">,
    }
  | {
      status: 'has_unresolved_dilemma',
      question: string,
      pet: Doc<"pets">,
    }
  | {
      status: 'graduated',
      pet: Doc<"pets">,
    }

// get an active pet & dilemmas
export const getActiveGameState = query({
  args: {},
  handler: async (ctx): Promise<GameState> => {
    try {
      const { userId, petId } = await getUserAndPetId(ctx);
      if (!userId) {
        return { status: 'not_authenticated' };
      }
      
      if (!petId) {
        return { status: 'needs_pet' };
      }

      // use try-catch to specifically handle pet retrieval errors
      try {
        const pet = await ctx.db.get(petId);
        if (!pet) {
          console.error(`[getActiveGameState] pet not found despite having petId ${petId}`);
          return { status: 'needs_pet' };
        }

        // get all dilemmas from db - wrap in try-catch for better error handling
        try {
          const allDilemmas = await ctx.db.query('dilemmas')
            .withIndex('by_petId', q => q.eq('petId', petId))
            .collect();
          const { seenDilemmas, unseenDilemmaTitles, unresolvedDilemma } = getPartitionedDilemmas(allDilemmas);

          if (pet.age >= 2) {
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
        } catch (dilemmaError) {
          // handle dilemma query errors specifically
          console.error("[getActiveGameState] Error retrieving dilemmas:", dilemmaError);
          throw new Error("Failed to retrieve dilemmas");
        }
      } catch (petError) {
        // handle pet retrieval errors specifically
        console.error("[getActiveGameState] Error retrieving pet:", petError);
        throw new Error("Failed to retrieve pet data");
      }
    } catch (error) {
      // capture and log the specific error message
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error(`[getActiveGameState] Unexpected error: ${errorMessage}`, error);
      
      // gracefully handle auth-related errors
      if (errorMessage.includes("auth") || errorMessage.includes("identity")) {
        return { status: 'not_authenticated' };
      }
      
      // re-throw to propagate the error to the client for better debugging
      throw error;
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
      .withIndex('by_petId', q => q.eq('petId', petId))
      .collect();

    // delete all dilemmas
    for (const dilemma of dilemmas) {
      await ctx.db.delete(dilemma._id);
    }

    // then delete the pet
    await ctx.db.delete(petId);
  },
});
