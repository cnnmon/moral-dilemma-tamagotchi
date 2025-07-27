import { EvolutionId } from "@/constants/evolutions";

type BaseStats = {
  health: number,
  hunger: number,
  happiness: number,
  sanity: number,
};

type MoralStats = {
  compassion: number,
  retribution: number,
  devotion: number,
  dominance: number,
  purity: number,
  ego: number,
};

export type ActiveDilemma = {
  id: string, // index into constant dilemmas
  messages: Array<{ // back and forth between pet and user if it's unclear
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  stats: MoralStats; // only defined after dilemma is completed
};

export type Pet = {
  id: string,
  name: string,
  age: number, // start as an baby
  evolutionIds: EvolutionId[], // only is defined after first evolution; if RIP is added, pet has died!
  personality: string,
  baseStats: BaseStats,
  moralStats: MoralStats,
  dilemmas: ActiveDilemma[],
};

export const createPet = async (name: string): Promise<Pet> => {
  const pets = JSON.parse(localStorage.getItem("pets") || "{}") as Record<string, Pet>;
  const id = crypto.randomUUID();
  const newPet = {
    id,
    name,
    age: 0,
    evolutionIds: [EvolutionId.BABY],
    personality: "",
    baseStats: { health: 5, hunger: 5, happiness: 5, sanity: 5 },
    moralStats: { compassion: 5, retribution: 5, devotion: 5, dominance: 5, purity: 5, ego: 5 },
    dilemmas: [],
  };
  pets[id] = newPet;
  localStorage.setItem("pets", JSON.stringify(pets));
  console.log("Added pet to localStorage", newPet);
  return newPet;
};

export const getPets = async () => {
  const pets = JSON.parse(localStorage.getItem("pets") || "{}") as Record<string, Pet>;
  return Object.values(pets);
};

export const getPet = async (id: string) => {
  const pets = JSON.parse(localStorage.getItem("pets") || "{}") as Record<string, Pet>;
  return pets[id];
};

