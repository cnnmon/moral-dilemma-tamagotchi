import { QueryCtx, MutationCtx } from './_generated/server';
import { Id } from './_generated/dataModel';

interface UserInfo {
  userId: string | null;
  petId: Id<'pets'> | null;
}

// simple in-memory cache for the last queried user ID
let lastUserId: string | null = null;
let lastUserIdTimestamp = 0;
const CACHE_TTL_MS = 30000; // 30 seconds

export async function getUserId(ctx: QueryCtx | MutationCtx): Promise<string | null> {
  try {
    // check if cache is still valid and not null
    if (lastUserId !== null && Date.now() - lastUserIdTimestamp < CACHE_TTL_MS) {
      return lastUserId;
    }
    
    // get identity from auth with a timeout mechanism for better resilience
    let identity;
    try {
      identity = await ctx.auth.getUserIdentity();
    } catch (authError) {
      console.error("[getUserId] Auth service error:", authError);
      
      // if we have a recent cached value, use it as fallback during auth outages
      if (lastUserId !== null && Date.now() - lastUserIdTimestamp < CACHE_TTL_MS * 2) {
        console.log("[getUserId] Using cached userId as fallback during auth error");
        return lastUserId;
      }
      
      throw new Error("Authentication service unavailable");
    }
    
    const userId = identity?.email || null;
    
    // only update cache if we got a valid userId
    if (userId !== null) {
      lastUserId = userId;
      lastUserIdTimestamp = Date.now();
    }
    
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
    // check if cache is still valid and not null values
    if (
      lastPetInfo !== null && 
      lastPetInfo.userId !== null && 
      lastPetInfo.petId !== null && 
      Date.now() - lastPetInfoTimestamp < CACHE_TTL_MS
    ) {
      return lastPetInfo;
    }
    
    const userId = await getUserId(ctx);
    if (!userId) {
      const result = { userId: null, petId: null };
      // Don't cache null results to allow retry
      return result;
    }

    try {
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
      
      // only update cache if we found a pet
      if (result.petId !== null) {
        lastPetInfo = result;
        lastPetInfoTimestamp = Date.now();
      }
      
      return result;
    } catch (dbError) {
      console.error("[getUserAndPetId] Database error:", dbError);
      
      // if we have a recent cache, use it as fallback during DB outages
      if (
        lastPetInfo !== null && 
        lastPetInfo.userId === userId && 
        Date.now() - lastPetInfoTimestamp < CACHE_TTL_MS * 2
      ) {
        console.log("[getUserAndPetId] Using cached pet info as fallback during DB error");
        return lastPetInfo;
      }
      
      throw new Error("Database service unavailable");
    }
  } catch (error) {
    console.error("[getUserAndPetId] Error retrieving pet:", error);
    // return safe fallback
    return {
      userId: null,
      petId: null,
    };
  }
}
