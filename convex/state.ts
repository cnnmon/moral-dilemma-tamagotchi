import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { getUserAndPetId } from "./user";
import { dilemmaTemplates, DilemmaTemplate } from "../constants/dilemmas";
import { getUnseenDilemmas } from "./lib/getUnseenDilemma";

export type GameState = 
  | { status: 'not_authenticated' }
  | { status: 'needs_pet' }
  | {
      status: 'has_dilemmas',
      dilemmas: DilemmaTemplate[],
      pet: Doc<"pets">
    }
  | {
      status: 'out_of_dilemmas',
      pet: Doc<"pets">
    }
  | {
      status: 'has_unresolved_dilemma',
      dilemma: DilemmaTemplate,
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

    // get all dilemmas this pet has seen and also resolved
    // filter dilemmas to get seen and unresolved ones using reduce
    const { seenDilemmas, unresolvedDilemmas } = allDilemmas.reduce(
      (acc: { seenDilemmas: Doc<"dilemmas">[]; unresolvedDilemmas: Doc<"dilemmas">[] }, dilemma) => {
        if (dilemma.resolved) {
          acc.seenDilemmas.push(dilemma);
        } else {
          acc.unresolvedDilemmas.push(dilemma);
        }
        return acc;
      },
      { seenDilemmas: [], unresolvedDilemmas: [] }
    );

    // if any unresolved dilemmas, return the clarifying question
    if (unresolvedDilemmas.length > 0) {
      for (const dilemma of unresolvedDilemmas) {
        // dilemma is still loading, so skip it
        if (!dilemma.outcome) {
          continue;
        }

        const templateDilemma = dilemmaTemplates[dilemma.title];
        return { 
          status: 'has_unresolved_dilemma', 
          dilemma: templateDilemma,
          question: dilemma.outcome,
          pet,
        };
      }
    }

    // get all unseen dilemmas
    const seenDilemmaTitles = seenDilemmas.map(d => d.title);
    const unseenDilemmas = getUnseenDilemmas(seenDilemmaTitles);
    
    if (!unseenDilemmas || unseenDilemmas.length === 0) {
      return { status: 'out_of_dilemmas', pet };
    }
    
    return {
      status: 'has_dilemmas',
      dilemmas: unseenDilemmas,
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
