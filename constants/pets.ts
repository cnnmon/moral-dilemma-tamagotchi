import { MoralDimensionsType } from "./morals";

export type Pet = {
  id: string;
  name: string;
  personality: string;
  evolutionId?: string;
  moralStats: Record<keyof MoralDimensionsType, number>;
}