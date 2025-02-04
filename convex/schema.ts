import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const moralStats = {
  compassion: v.number(), // 1-10 (1 = empathy, 10 = indifference)
  retribution: v.number(), // 1-10 (1 = justice, 10 = forgiveness)
  devotion: v.number(), // 1-10 (1 = loyalty, 10 = integrity)
  dominance: v.number(), // 1-10 (1 = authority, 10 = autonomy)
  purity: v.number(), // 1-10 (1 = virtue, 10 = indulgence)
  ego: v.number(), // 1-10 (1 = self-sacrificing, 10 = self-serving)
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
    evolutionId: v.string(), // evolution string identifier
    personality: v.string(), // traits (> 150 characters)
    baseStats: v.object(baseStats), // ends game if 0
    moralStats: v.object(moralStats),
    history: v.id("responses"),
  }).index("by_userId", ["userId"]),

  dilemmas: defineTable({
    userId: v.string(),
    petId: v.id("pets"), // pet id
    dilemmaId: v.string(), // dilemma string identifier
    responseText: v.string(), // player's input
    updatedMoralStats: v.optional(v.object(moralStats)),
    updatedPersonality: v.optional(v.string()), // updated personality
    reaction: v.optional(v.string()), // reaction text
  }).index("by_userId", ["userId"]),
});
