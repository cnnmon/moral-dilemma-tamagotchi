import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserAndPetId } from './user';

// get the user's pet status and data
export const getPetStatus = query({
  args: {},
  handler: async (ctx) => {
    const userInfo = await getUserAndPetId(ctx);
    if (userInfo.status === 'not_authenticated') return null;

    // if user has a pet, get its data
    const pet = userInfo.petId ? await ctx.db.get(userInfo.petId) : null;

    return {
      status: userInfo.status,
      pet,
    };
  },
});

// get a specific pet by id
export const getPetById = query({
  args: {
    petId: v.id('pets'),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserAndPetId(ctx);
    if (!userId) return null;

    // get the pet
    const pet = await ctx.db.get(args.petId);
    
    // ensure the pet belongs to this user
    if (!pet || pet.userId !== userId) {
      return null;
    }

    return pet;
  },
});

// create a new pet
export const createPet = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, status } = await getUserAndPetId(ctx);
    if (!userId) throw new Error('not authenticated');
    if (status === 'has_pet') throw new Error('you already have a pet');

    // create the pet with default stats
    return ctx.db.insert('pets', {
      userId,
      name: args.name,
      evolutionId: 'egg', // start as an egg
      personality: 'a curious little egg, waiting to hatch and discover the world',
      baseStats: {
        health: 5,
        hunger: 5,
        happiness: 5,
        sanity: 5,
      },
      moralStats: {
        compassion: 5,
        retribution: 5,
        devotion: 5,
        dominance: 5,
        purity: 5,
        ego: 5,
      },
      history: [],
      graduated: false,
    });
  },
}); 