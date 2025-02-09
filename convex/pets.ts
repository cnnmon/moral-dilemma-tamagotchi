import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserAndPetId } from './user';

// get the user's pet status and data
export const getActivePet = query({
  args: {},
  handler: async (ctx) => {
    const { petId } = await getUserAndPetId(ctx);
    if (!petId) {
      return null;
    }

    // if user has a pet, get its data
    const pet = await ctx.db.get(petId);
    return pet;
  },
});

// create a new pet
export const createPet = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserAndPetId(ctx);
    if (!userId) throw new Error('not authenticated');

    // create the pet with default stats
    return ctx.db.insert('pets', {
      userId,
      name: args.name,
      age: 0, // start as an baby
      evolutionId: 'baby', // only is defined after first evolution
      personality: '',
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
      graduated: false,
    });
  },
}); 