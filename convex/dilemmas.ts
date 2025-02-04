import { v } from "convex/values";
import { mutation } from "./_generated/server";

// handles dilemma responses
export const handleDilemmaResponse = mutation({
  args: {
    dilemmaId: v.string(),
    responseText: v.string(),
  },
  handler: async ({ ctx, args }) => {
    const 
  },
});