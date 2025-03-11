import { QueryCtx, MutationCtx } from './_generated/server';
import { Id } from './_generated/dataModel';

interface UserInfo {
  userId: string | null;
  petId: Id<'pets'> | null;
}

// Simple in-memory cache for the last queried user ID
let lastUserId: string | null = null;
let lastUserIdTimestamp = 0;
const CACHE_TTL_MS = 30000; // 30 seconds

export async function getUserId(ctx: QueryCtx | MutationCtx): Promise<string | null> {
  try {
    // Check if cache is still valid
    if (lastUserId !== null && Date.now() - lastUserIdTimestamp < CACHE_TTL_MS) {
      return lastUserId;
    }
    
    // Get identity from auth
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.email || null;
    
    // Update cache
    lastUserId = userId;
    lastUserIdTimestamp = Date.now();
    
    return userId;
  } catch (error) {
    // log the error but don't throw - return null for unauthenticated state
    console.error("[getUserId] Error retrieving user identity:", error);
    return null;
  }
}

// in-memory cache for the last retrieved pet
let lastPetInfo: UserInfo | null = null;
let lastPetInfoTimestamp = 0;

// internal helper to get user info and latest pet
export async function getUserAndPetId(
  ctx: QueryCtx | MutationCtx
): Promise<UserInfo> {
  try {
    // Check if cache is still valid
    if (lastPetInfo !== null && Date.now() - lastPetInfoTimestamp < CACHE_TTL_MS) {
      return lastPetInfo;
    }
    
    const userId = await getUserId(ctx);
    if (!userId) {
      const result = { userId: null, petId: null };
      lastPetInfo = result;
      lastPetInfoTimestamp = Date.now();
      return result;
    }

    // get latest active pet for this user
    const latestPet = await ctx.db
      .query('pets')
      .withIndex('by_userId', q => q.eq('userId', userId))
      //.filter(q => q.eq(q.field('graduated'), false))
      .order('desc')
      .first();

    const result = {
      userId,
      petId: latestPet?._id ?? null,
    };
    
    // Update cache
    lastPetInfo = result;
    lastPetInfoTimestamp = Date.now();
    
    return result;
  } catch (error) {
    console.error("[getUserAndPetId] Error retrieving pet:", error);
    // return safe fallback
    return {
      userId: null,
      petId: null,
    };
  }
}
