import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Simple one-way tracking of user responses to dilemmas
export const trackDilemmaResponse = mutation({
  args: {
    id: v.optional(v.id("dilemmas")),
    title: v.string(),
    responseText: v.string(),
    outcome: v.optional(v.string()),
    messages: v.optional(
      v.array(
        v.object({
          role: v.string(),
          content: v.string(),
        })
      )
    ),
    updatedMoralStats: v.optional(
      v.object({
        compassion: v.optional(v.number()),
        retribution: v.optional(v.number()),
        devotion: v.optional(v.number()),
        dominance: v.optional(v.number()),
        purity: v.optional(v.number()),
        ego: v.optional(v.number()),
      })
    ),
    updatedPersonality: v.optional(v.string()),
    resolved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Update existing record if id provided; otherwise insert a new one
    if (args.id) {
      await ctx.db.patch(args.id, {
        title: args.title,
        responseText: args.responseText,
        outcome: args.outcome,
        messages: args.messages,
        updatedMoralStats: args.updatedMoralStats,
        updatedPersonality: args.updatedPersonality,
        resolved: args.resolved ?? false,
      });
      console.log("📝 Updated dilemma response:", args.id);
      return { success: true, dilemmaId: args.id };
    }

    const dilemmaId = await ctx.db.insert("dilemmas", {
      userId: "local_user",
      petId: undefined,
      title: args.title,
      responseText: args.responseText,
      outcome: args.outcome,
      messages: args.messages,
      updatedMoralStats: args.updatedMoralStats,
      updatedPersonality: args.updatedPersonality,
      resolved: args.resolved ?? false,
    });
    console.log("📝 Tracked dilemma response:", dilemmaId);
    return { success: true, dilemmaId };
  },
});
