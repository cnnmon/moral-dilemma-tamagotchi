// moral stats range from 1-10
export enum MoralDimensions {
  compassion = "compassion", // 1-10 (1 = empathy, 10 = indifference)
  retribution = "retribution", // 1-10 (1 = justice, 10 = forgiveness)
  devotion = "devotion", // 1-10 (1 = loyalty, 10 = integrity)
  dominance = "dominance", // 1-10 (1 = authority, 10 = autonomy)
  purity = "purity", // 1-10 (1 = virtue, 10 = indulgence)
  ego = "ego", // 1-10 (1 = self-sacrificing, 10 = self-serving)
}

export type MoralDimensionsType = Record<MoralDimensions, number>;
