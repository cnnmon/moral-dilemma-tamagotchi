import { v } from "convex/values";
import { mutation, query, internalAction } from "./_generated/server";
import { api, internal } from './_generated/api';
import { getUserAndPetId } from './user';
import { dilemmaTemplates } from '../constants/dilemmas';
import { MoralDimensionsType } from '../constants/morals';
import processDilemmaResponse from './lib/processDilemmaResponse'
import { Id } from './_generated/dataModel';

type ProcessedResponse = {
  ok: boolean;
  override?: boolean;
  outcome?: string;
  stats?: Partial<MoralDimensionsType>;
  personality?: string;
};

// get a saved dilemma by id
export const getDilemmaById = query({
  args: { dilemmaId: v.id('dilemmas') },
  handler: async (ctx, args) => {
    const dilemma = await ctx.db.get(args.dilemmaId);
    if (!dilemma) {
      return null;
    }
    return {
      ok: dilemma.resolved,
      outcome: dilemma.outcome,
      resolved: dilemma.resolved,
    };
  },
});

// process a dilemma response
export const processDilemma = mutation({
  args: {
    dilemma: v.object({
      title: v.string(),
      text: v.string(),
    }),
    responseText: v.string(),
  },
  handler: async (ctx, args): Promise<{ ok: boolean; dilemmaId: Id<'dilemmas'> }> => {
    console.log('🚀 Starting processDilemma with args:', args);
    const { petId } = await getUserAndPetId(ctx);
    if (!petId) {
      console.error('❌ No active pet found');
      throw new Error('❌ No active pet found');
    }

    // get the pet's current state
    const pet = await ctx.db.get(petId);
    if (!pet) {
      console.error('❌ Pet not found in database');
      throw new Error('❌ Pet not found in database');
    }
    console.log('🐦 Found pet:', { name: pet.name, id: pet._id });

    // check if dilemma already exists
    const existingDilemma = await ctx.db.query('dilemmas')
      .withIndex('by_userAndPetId', q => q.eq('userId', pet.userId).eq('petId', petId))
      .filter(q => q.eq(q.field('title'), args.dilemma.title))
      .first();
    
    let dilemmaId: Id<'dilemmas'>;
    if (existingDilemma) {
      // seen this dilemma? probably pet asked a clarifying question!
      // or there is some api error... anyways handle gracefully
      console.log('🔄 Dilemma already exists, skipping insertion');
      if (existingDilemma.resolved) {
        throw new Error('❌ Dilemma already resolved');
      }

      dilemmaId = existingDilemma._id;
    } else {
      // new dilemma creation to track progress
      dilemmaId = await ctx.db.insert('dilemmas', {
        userId: pet.userId,
        petId,
        title: args.dilemma.title,
        responseText: args.responseText,
        // these will be updated when the action completes
        outcome: undefined,
        updatedMoralStats: undefined,
        updatedPersonality: undefined,
        resolved: false,
      });
      console.log('✅ Initial dilemma saved with ID:', dilemmaId);
    }

    // schedule action to generate response from llm
    await ctx.scheduler.runAfter(0, internal.dilemmas.generateResponse, {
      responseText: args.responseText,
      userId: pet.userId,
      dilemmaId,
      dilemmaTitle: args.dilemma.title,
      petId: pet._id,
    });
    console.log('🤖 LLM processing scheduled!');

    // return the dilemma id so the client can subscribe to updates
    return { ok: true, dilemmaId };
  }
});

// process response with openai
export const generateResponse = internalAction({
  args: {
    petId: v.id('pets'),
    dilemmaId: v.id('dilemmas'),
    dilemmaTitle: v.string(),
    responseText: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<ProcessedResponse> => {
    const pet = await ctx.runQuery(api.pets.getPetById, { petId: args.petId })
    if (!pet) {
      throw new Error('❌ No pet exists for ' + args.userId);
    }

    // process dilemma with the response text
    const templateDilemma = dilemmaTemplates[args.dilemmaTitle];
    const generatedResponse = await processDilemmaResponse({
      pet,
      dilemma: templateDilemma,
      responseText: args.responseText,
    });

    // parse response by hand
    const parsedResponse = JSON.parse(generatedResponse as string);
    console.log('🔄 Validated response:', parsedResponse);

    if (!parsedResponse.ok) {
      // if the response is not ok, it is a clarifying question
      const clarifyingQuestion = parsedResponse.outcome;
      await ctx.runMutation(api.dilemmas.updateDilemmaAndPet, {
        dilemmaId: args.dilemmaId,
        petId: pet._id,
        outcome: clarifyingQuestion,
        resolved: false,
      });
    } else if (parsedResponse.override) {
      // if the response is overridden by the pet's personality, update that
      await ctx.runMutation(api.dilemmas.updateDilemmaAndPet, {
        dilemmaId: args.dilemmaId,
        petId: pet._id,
        outcome: parsedResponse.outcome,
        updatedMoralStats: parsedResponse.stats as MoralDimensionsType | undefined,
        updatedPersonality: parsedResponse.personality,
        resolved: true,
        overridden: true,
      });
    } else {
      // if the response is not overridden, update the dilemma
      await ctx.runMutation(api.dilemmas.updateDilemmaAndPet, {
        dilemmaId: args.dilemmaId,
        petId: pet._id,
        outcome: parsedResponse.outcome,
        updatedMoralStats: parsedResponse.stats as MoralDimensionsType | undefined,
        updatedPersonality: parsedResponse.personality,
        resolved: true,
      });
    }
    return parsedResponse;
  },
});

// update the dilemma with processed results
export const updateDilemmaAndPet = mutation({
  args: {
    dilemmaId: v.id('dilemmas'),
    petId: v.id('pets'),
    outcome: v.string(),
    updatedMoralStats: v.optional(v.object({
      compassion: v.number(),
      retribution: v.number(),
      devotion: v.number(),
      dominance: v.number(),
      purity: v.number(),
      ego: v.number(),
    })),
    updatedPersonality: v.optional(v.string()),
    resolved: v.boolean(),
    overridden: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // update dilemma response
    await ctx.db.patch(args.dilemmaId, {
      outcome: args.outcome,
      updatedMoralStats: args.updatedMoralStats as MoralDimensionsType | undefined,
      updatedPersonality: args.updatedPersonality,
      resolved: args.resolved,
      overridden: args.overridden,
    });

    // update pet with new moral stats and personality
    if (args.updatedMoralStats) {
      await ctx.db.patch(args.petId, {
        moralStats: args.updatedMoralStats as MoralDimensionsType | undefined,
        personality: args.updatedPersonality,
      });
    }
  },
});