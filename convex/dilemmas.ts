import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Simple one-way tracking of user responses to dilemmas
export const trackDilemmaResponse = mutation({
  args: {
    title: v.string(),
    responseText: v.string(),
    outcome: v.optional(v.string()),
    resolved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Insert the dilemma response into the database for tracking
    const dilemmaId = await ctx.db.insert("dilemmas", {
      userId: "local_user", // default fallback since not required
      petId: undefined, // optional field
      title: args.title,
      responseText: args.responseText,
      outcome: args.outcome,
      resolved: args.resolved ?? false,
    });
    
    console.log("📝 Tracked dilemma response:", dilemmaId);
    return { success: true, dilemmaId };
  },
});
