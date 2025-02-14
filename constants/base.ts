// base stats for pet health and wellbeing
export enum BaseStatKeys {
  health = "health",
  hunger = "hunger",
  happiness = "happiness",
  sanity = "sanity",
}

export type BaseStatsType = Record<BaseStatKeys, number>;

export type PooType = {
  x: number;
  y: number;
  id: number;
};
