import { QueryCtx, MutationCtx } from './_generated/server';
import { Id } from './_generated/dataModel';

interface UserInfo {
  userId: string | null;
  petId: Id<'pets'> | null;
}

// Generate a unique user ID for local storage
function generateLocalUserId(): string {
  return 'local_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
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
    
    // Try to get identity from auth, but fallback to local user generation
    let userId: string | null = null;
    try {
      const identity = await ctx.auth.getUserIdentity();
      userId = identity?.email || null;
    } catch {
      console.log("[getUserId] No auth available, using local user ID");
    }
    
    // If no auth user, generate a local user ID
    if (!userId) {
      userId = generateLocalUserId();
      console.log("[getUserId] Generated local user ID:", userId);
    }
    
    // Update cache
    lastUserId = userId;
    lastUserIdTimestamp = Date.now();
    
    return userId;
  } catch (error) {
    // Generate local user ID as fallback
    console.log("[getUserId] Error, generating local user ID:", error);
    const userId = generateLocalUserId();
    lastUserId = userId;
    lastUserIdTimestamp = Date.now();
    return userId;
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
      return result;
    }

    try {
      // get latest active pet for this user
      const latestPet = await ctx.db
        .query('pets')
        .withIndex('by_userId', q => q.eq('userId', userId))
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
      
      // Return with userId but no pet
      return {
        userId,
        petId: null,
      };
    }
  } catch (error) {
    console.error("[getUserAndPetId] Error retrieving pet:", error);
    // Generate a user ID even in error case
    const userId = generateLocalUserId();
    return {
      userId,
      petId: null,
    };
  }
}
