import { v } from "convex/values";
import { mutation, query, internalAction } from "./_generated/server";
import { api, internal } from './_generated/api';
import { getUnseenDilemma } from './lib/getUnseenDilemma';
import { getUserAndPetId } from './user';
import { Dilemma, dilemmas } from '../constants/dilemmas';
import { MoralDimensionsType } from '../constants/morals';
import processDilemmaResponse from './lib/processDilemmaResponse'
import { Id } from './_generated/dataModel';

type DilemmaResult = 
  | { status: 'not_authenticated' }
  | { status: 'needs_pet' }
  | { status: 'has_dilemma', dilemma: Dilemma }
  | { status: 'out_of_dilemmas' }

type ProcessedResponse = {
  ok: boolean;
  override?: boolean;
  outcome?: string;
  stats?: Partial<MoralDimensionsType>;
  personality?: string;
};

// get an unseen dilemma for a pet
export const getNextDilemma = query({
  args: {},
  handler: async (ctx): Promise<DilemmaResult> => {
    const { userId, petId } = await getUserAndPetId(ctx);
    
    if (!userId) {
      return { status: 'not_authenticated' };
    }
    
    if (!petId) {
      return { status: 'needs_pet' };
    }

    // get all dilemmas from db
    const allDilemmas = await ctx.db.query('dilemmas')
      .withIndex('by_userAndPetId', q => q.eq('userId', userId).eq('petId', petId))
      .collect();

    // get all dilemmas this pet has seen and also resolved
    // (so unresolved dilemmas can come back)
    const seenDilemmas = allDilemmas.filter(d => d.resolved);
    const unresolvedDilemmas = allDilemmas.filter(d => !d.resolved);

    // if any unresolved dilemmas, return the clarifying question
    if (unresolvedDilemmas.length > 0) {
      for (const dilemma of unresolvedDilemmas) {
        // dilemma is still loading, so skip it
        if (!dilemma.outcome) {
          continue;
        }

        return { status: 'has_dilemma', dilemma: {
          id: dilemma.title,
          text: dilemma.outcome,
          relatedStats: [],
          stakes: 0,
        } };
      }
    }

    // get random unseen dilemma
    const seenDilemmaIds = seenDilemmas.map(d => d.title);
    const dilemma = getUnseenDilemma(seenDilemmaIds);
    
    if (!dilemma) {
      return { status: 'out_of_dilemmas' };
    }
    
    return {
      status: 'has_dilemma',
      dilemma: dilemma,
    };
  },
});

// get a dilemma by id
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
    console.log('👤 petId:', petId);
    
    if (!petId) {
      console.error('❌ No active pet found');
      throw new Error('no active pet found');
    }

    // get the pet's current state
    const pet = await ctx.db.get(petId);
    console.log('🐦 Found pet:', pet ? { name: pet.name, id: pet._id } : null);
    
    if (!pet) {
      console.error('❌ Pet not found in database');
      throw new Error('pet not found');
    }

    // save initial response
    console.log('💾 Saving initial response...');
    
    // if dilemma already exists
    const existingDilemma = await ctx.db.query('dilemmas')
      .withIndex('by_userAndPetId', q => q.eq('userId', pet.userId).eq('petId', petId))
      .filter(q => q.eq(q.field('title'), args.dilemma.title))
      .first();
    
    let dilemmaId: Id<'dilemmas'>;
    if (existingDilemma) {
      console.log('🔄 Dilemma already exists, skipping insertion');

      // if dilemma was resolved already, throw
      if (existingDilemma.resolved) {
        throw new Error('dilemma already resolved');
      }

      // else it was an api error
      dilemmaId = existingDilemma._id;
    } else {
      // else it was a new dilemma
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
    console.log('🤖 Scheduling OpenAI processing...');
    await ctx.scheduler.runAfter(0, internal.dilemmas.generateResponse, {
      responseText: args.responseText,
      userId: pet.userId,
      dilemma: args.dilemma,
      pet: {
        _id: pet._id,
        name: pet.name,
        evolutionId: pet.evolutionId,
        personality: pet.personality,
        moralStats: pet.moralStats,
        age: pet.age,
      },
      dilemmaId,
    });
    console.log('✅ OpenAI processing scheduled');

    // return the dilemma id so the client can subscribe to updates
    return { ok: true, dilemmaId };
  }
});

// process response with openai
export const generateResponse = internalAction({
  args: {
    dilemmaId: v.id('dilemmas'),
    dilemma: v.object({
      title: v.string(),
      text: v.string(),
    }),
    responseText: v.string(),
    userId: v.string(),
    pet: v.object({
      _id: v.id('pets'),
      name: v.string(),
      evolutionId: v.optional(v.string()),
      personality: v.string(),
      age: v.number(),
      moralStats: v.object({
        compassion: v.number(),
        retribution: v.number(),
        devotion: v.number(),
        dominance: v.number(),
        purity: v.number(),
        ego: v.number(),
      }),
    }),
  },
  handler: async (ctx, args): Promise<ProcessedResponse> => {
    console.log('🤖 Starting generateResponse with args:', {
      dilemmaId: args.dilemmaId,
      petName: args.pet.name,
    });
    
    const { pet, responseText } = args;
    const dilemma = dilemmas[args.dilemma.title];
    
    // process with openai
    console.log('🔄 Calling OpenAI...');
    const generatedResponse = await processDilemmaResponse({
      pet,
      dilemmaText: dilemma.text,
      responseText,
    });
    console.log('✅ OpenAI response received:', generatedResponse);

    // parse response
    const parsedResponse = JSON.parse(generatedResponse as string);
    console.log('🔄 Validated response:', parsedResponse);

    // if the response is not ok, it is a clarifying question
    if (!parsedResponse.ok) {
      const clarifyingQuestion = parsedResponse.outcome;
      await ctx.runMutation(api.dilemmas.updateDilemmaAndPet, {
        dilemmaId: args.dilemmaId,
        petId: args.pet._id,
        outcome: clarifyingQuestion,
        resolved: false,
      });
      return parsedResponse;
    }

    // if the response is overridden by the pet's personality, update that
    if (parsedResponse.override) {
      await ctx.runMutation(api.dilemmas.updateDilemmaAndPet, {
        dilemmaId: args.dilemmaId,
        petId: args.pet._id,
        outcome: parsedResponse.outcome,
        updatedMoralStats: parsedResponse.stats as MoralDimensionsType | undefined,
        updatedPersonality: parsedResponse.personality,
        resolved: true,
        overridden: true,
      });
    }

    // if the response is not overridden, update the dilemma
    await ctx.runMutation(api.dilemmas.updateDilemmaAndPet, {
      dilemmaId: args.dilemmaId,
      petId: args.pet._id,
      outcome: parsedResponse.outcome,
      updatedMoralStats: parsedResponse.stats as MoralDimensionsType | undefined,
      updatedPersonality: parsedResponse.personality,
      resolved: true,
    });

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