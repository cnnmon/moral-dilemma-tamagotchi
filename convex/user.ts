import { QueryCtx, MutationCtx } from './_generated/server';
import { Id } from './_generated/dataModel';

interface UserInfo {
  userId: string | null;
  petId: Id<'pets'> | null;
  status: 'needs_pet' | 'has_pet' | 'not_authenticated';
}

// internal helper to get user info and latest pet
export async function getUserAndPetId(
  ctx: QueryCtx | MutationCtx
): Promise<UserInfo> {
  // get user identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.email) {
    return { 
      userId: null, 
      petId: null, 
      status: 'not_authenticated' 
    };
  }

  const userId = identity.email;

  // get latest active pet for this user
  const latestPet = await ctx.db
    .query('pets')
    .withIndex('by_userId', q => q.eq('userId', userId))
    .filter(q => q.eq(q.field('graduated'), false))
    .order('desc')
    .first();

  return {
    userId,
    petId: latestPet?._id ?? null,
    status: latestPet ? 'has_pet' : 'needs_pet',
  };
}
