import { v } from "convex/values";
import { mutation, query, internalAction } from "./_generated/server";
import { api, internal } from './_generated/api';
import { getUnseenDilemma } from '../lib/dilemmaSelection';
import { getUserAndPetId } from './user';
import { Dilemma, dilemmas } from '../constants/dilemmas';
import { MoralDimensionsType } from '../constants/morals';
import processDilemmaResponse from '../lib/processDilemmaResponse'

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
    const userInfo = await getUserAndPetId(ctx);
    
    if (userInfo.status === 'not_authenticated') {
      return { status: 'not_authenticated' };
    }
    
    if (userInfo.status === 'needs_pet') {
      return { status: 'needs_pet' };
    }
    
    const petId = userInfo.petId;
    if (!petId) {
      throw new Error('invalid state: has_pet but no petId');
    }

    // get all dilemmas this pet has seen
    const seenDilemmas = await ctx.db
      .query('dilemmas')
      .withIndex('by_petId', q => q.eq('petId', petId))
      .collect();

    // get the seen dilemma ids
    const seenDilemmaIds = seenDilemmas.map(d => d.title);

    // get a random unseen dilemma
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

// process a dilemma response
export const processDilemma = mutation({
  args: {
    dilemma: v.object({
      title: v.string(),
      text: v.string(),
    }),
    responseText: v.string(),
  },
  handler: async (ctx, args): Promise<{ outcome?: string }> => {
    console.log('🚀 Starting processDilemma with args:', args);
    
    const { petId, status } = await getUserAndPetId(ctx);
    console.log('👤 User status:', status, 'petId:', petId);
    
    if (status !== 'has_pet' || !petId) {
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
    const dilemmaId = await ctx.db.insert('dilemmas', {
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

    // schedule action to generate response from llm
    console.log('🤖 Scheduling OpenAI processing...');
    await ctx.scheduler.runAfter(0, internal.dilemmas.generateResponse, {
      responseText: args.responseText,
      userId: pet.userId,
      dilemma: args.dilemma,
      pet: {
        id: petId,
        name: pet.name,
        personality: pet.personality,
        moralStats: pet.moralStats,
      },
      dilemmaId,
    });
    console.log('✅ OpenAI processing scheduled');

    return {};
  },
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
      id: v.id('pets'),
      name: v.string(),
      personality: v.string(),
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
      await ctx.runMutation(api.dilemmas.updateDilemma, {
        dilemmaId: args.dilemmaId,
        outcome: clarifyingQuestion,
        resolved: false,
      });
    } else {
      await ctx.runMutation(api.dilemmas.updateDilemma, {
        dilemmaId: args.dilemmaId,
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
export const updateDilemma = mutation({
  args: {
    dilemmaId: v.id('dilemmas'),
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
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.dilemmaId, {
      outcome: args.outcome,
      updatedMoralStats: args.updatedMoralStats as MoralDimensionsType | undefined,
      updatedPersonality: args.updatedPersonality,
      resolved: args.resolved,
    });
  },
});

