import { EGG_CRACK_SHOWN_KEY } from "@/app/play/components/Viewport";
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
  stats?: MoralStats; 
  completed: boolean;
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

// Debounced save function to prevent excessive localStorage writes
let saveTimeout: NodeJS.Timeout | null = null;
const debouncedSave = (key: string, data: Pet[], delay = 500) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save ${key}:`, error);
    }
  }, delay);
};

// Optimized pet loading with error handling
export const getPets = (): Pet[] => {
  try {
    const pets = JSON.parse(localStorage.getItem("pets") || "[]") as Pet[];
    return pets;
  } catch (error) {
    console.warn("Failed to load pets, returning empty array:", error);
    return [];
  }
};

export const createPet = async (name: string): Promise<Pet> => {
  const pets = getPets();
  const newPet = {
    id: crypto.randomUUID(),
    name,
    age: 0,
    evolutionIds: [EvolutionId.BABY],
    personality: "",
    baseStats: { health: 5, hunger: 5, happiness: 5, sanity: 5 },
    moralStats: { compassion: 5, retribution: 5, devotion: 5, dominance: 5, purity: 5, ego: 5 },
    dilemmas: [],
  };
  
  // remove local storage about egg and poos
  localStorage.removeItem(EGG_CRACK_SHOWN_KEY);
  localStorage.removeItem("poos");

  pets.push(newPet);
  debouncedSave("pets", pets, 0);
  console.log("Added pet to localStorage", newPet);
  return newPet;
};

export const savePet = (pet: Pet): void => {
  const pets = getPets();
  pets.push(pet);
  debouncedSave("pets", pets); // Debounced save for regular updates
};

export const updatePet = (id: string, updates: Partial<Pet>): Pet | null => {
  const pets = getPets();
  const pet = pets.find((pet) => pet.id === id);
  if (!pet) return null;
  
  const updatedPet = { ...pet, ...updates };
  pets.push(updatedPet);
  debouncedSave("pets", pets); // Debounced save
  return updatedPet;
};

