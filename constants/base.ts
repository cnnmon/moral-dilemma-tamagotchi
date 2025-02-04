// base stats for pet health and wellbeing
export enum BaseStats {
  health = "health",
  hunger = "hunger",
  happiness = "happiness",
  sanity = "sanity",
}

export type BaseStatsType = Record<BaseStats, number>;
