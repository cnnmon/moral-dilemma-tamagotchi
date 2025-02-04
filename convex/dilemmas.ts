import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { processDilemmaResponse } from '../lib/dilemma';
import { MoralDimensionsType } from '../constants/morals';

// process a dilemma response and update the pet's stats
export const processDilemma = mutation({
  args: {
    petId: v.id('pets'),
    dilemmaId: v.string(),
    responseText: v.string(),
  },
  handler: async ({ db }, args) => {
    // get the pet's current state
    const pet = await db.get(args.petId);
    if (!pet) {
      throw new Error('pet not found');
    }

    // process the response with openai
    const response = await processDilemmaResponse({
      petName: pet.name,
      dilemmaText: args.dilemmaId,
      response: args.responseText,
      personality: pet.personality,
      moralStats: pet.moralStats,
      sanity: pet.baseStats.sanity,
    });

    // if we need clarification, just save the response
    if (!response.ok) {
      return db.insert('dilemmas', {
        userId: pet.userId,
        petId: args.petId,
        dilemmaId: args.dilemmaId,
        responseText: args.responseText,
        reaction: response.question,
      });
    }

    // update the pet's stats if provided
    if (response.stats) {
      const updatedStats = response.stats as MoralDimensionsType;
      await db.patch(args.petId, {
        moralStats: {
          ...pet.moralStats,
          ...updatedStats,
        },
      });
    }

    // update the pet's personality if provided
    if (response.personality) {
      await db.patch(args.petId, {
        personality: response.personality,
      });
    }

    // update the pet's sanity if provided
    if (response.sanity !== undefined) {
      await db.patch(args.petId, {
        baseStats: {
          ...pet.baseStats,
          sanity: response.sanity,
        },
      });
    }

    // save the dilemma response
    return db.insert('dilemmas', {
      userId: pet.userId,
      petId: args.petId,
      dilemmaId: args.dilemmaId,
      responseText: response.override ? response.decision! : args.responseText,
      updatedMoralStats: response.stats as MoralDimensionsType | undefined,
      updatedPersonality: response.personality,
      reaction: response.reaction,
    });
  },
});