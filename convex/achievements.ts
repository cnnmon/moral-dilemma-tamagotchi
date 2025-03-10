import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AchievementId, getAchievement, getStage1EvolutionAchievementIds, getStage2EvolutionAchievementIds } from "../constants/achievements";
import { MutationCtx } from "./_generated/server";
import { getUserId } from "./user";

// get all of a user's achievements
export const getUserAchievements = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return [];
    }

    const achievements = await ctx.db
      .query("achievements")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    
    return achievements.map(achievement => ({
      ...achievement,
      details: getAchievement(achievement.achievementId as AchievementId)
    }));
  },
});

// unlock a new achievement
export const unlockAchievement = mutation({
  args: {
    achievementId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) {
      return [];
    }

    // check if the achievement is already unlocked
    const existingAchievement = await ctx.db
      .query("achievements")
      .withIndex("by_userAndAchievement", q => 
        q.eq("userId", userId).eq("achievementId", args.achievementId)
      )
      .first();
    
    if (existingAchievement) {
      return existingAchievement._id; // already unlocked
    }
    
    // unlock the achievement
    const achievementId = await ctx.db.insert("achievements", {
      userId,
      achievementId: args.achievementId,
      timestamp: Date.now(),
    });
    
    // check for collection achievements
    await checkForCollectionAchievements(ctx, userId);
    return achievementId;
  },
});

// helper function to check for collection achievements
async function checkForCollectionAchievements(
  ctx: MutationCtx,
  userId: string
) {
  const userAchievements = await ctx.db
    .query("achievements")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .collect();
  
  const unlockedIds = userAchievements.map(a => a.achievementId);
  
  // check for stage 1 collection
  const stage1Ids = getStage1EvolutionAchievementIds();
  const hasAllStage1 = stage1Ids.every(id => unlockedIds.includes(id));
  
  if (hasAllStage1 && !unlockedIds.includes("collect_all_stage1")) {
    await ctx.db.insert("achievements", {
      userId,
      achievementId: "collect_all_stage1",
      timestamp: Date.now(),
    });
  }
  
  // check for stage 2 collection
  const stage2Ids = getStage2EvolutionAchievementIds();
  const hasAllStage2 = stage2Ids.every(id => unlockedIds.includes(id));
  
  if (hasAllStage2 && !unlockedIds.includes("collect_all_stage2")) {
    await ctx.db.insert("achievements", {
      userId,
      achievementId: "collect_all_stage2",
      timestamp: Date.now(),
    });
  }
  
  // check for complete collection
  if (
    hasAllStage1 && 
    hasAllStage2 && 
    !unlockedIds.includes("collect_all")
  ) {
    await ctx.db.insert("achievements", {
      userId,
      achievementId: "collect_all",
      timestamp: Date.now(),
    });
  }
} 