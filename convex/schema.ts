import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const moralStats = {
  compassion: v.number(), // 0-10 (0 = empathy, 10 = indifference)
  retribution: v.number(), // 0-10 (0 = justice, 10 = forgiveness)
  devotion: v.number(), // 0-10 (0 = loyalty, 10 = integrity)
  dominance: v.number(), // 0-10 (0 = authority, 10 = autonomy)
  purity: v.number(), // 0-10 (0 = virtue, 10 = indulgence)
  ego: v.number(), // 0-10 (0 = self-sacrificing, 10 = self-serving)
};

const baseStats = {
  health: v.number(),
  hunger: v.number(),
  happiness: v.number(),
  sanity: v.number(),
};

export default defineSchema({
  pets: defineTable({
    userId: v.string(), // owner of the pet as email
    name: v.string(),
    age: v.number(), // represents 1-3 stages of growth
    evolutionId: v.string(), // evolution string identifier
    personality: v.string(), // traits (> 150 characters)
    baseStats: v.object(baseStats), // ends game if 0
    moralStats: v.object(moralStats),
  }).index("by_userId", ["userId"]),

  dilemmas: defineTable({
    userId: v.string(),
    petId: v.id("pets"), // pet id
    title: v.string(), // dilemma string identifier
    responseText: v.string(), // player's input
    outcome: v.optional(v.string()), // pet's decision or question
    updatedMoralStats: v.optional(v.object(moralStats)),
    updatedPersonality: v.optional(v.string()), // updated personality
    resolved: v.boolean(), // whether the response is resolved
    overridden: v.optional(v.boolean()), // whether the response is overridden by the pet's personality
  })
    .index("by_petId", ["petId"]),
    
});
