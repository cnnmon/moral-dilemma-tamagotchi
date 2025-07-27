import { AchievementId } from "@/constants/achievements";
import { DEFAULT_AVERAGE_STATS } from "@/constants/morals";

// Local storage keys
const LOCAL_USER_ID_KEY = "local_user_id";
const LOCAL_PETS_KEY = "local_pets";
const LOCAL_ACHIEVEMENTS_KEY = "local_achievements";

// Simplified Pet type with embedded dilemmas
export interface SimplePet {
  _id: string;
  _creationTime: number;
  userId: string;
  name: string;
  age: number;
  evolutionId: string;
  personality: string;
  baseStats: {
    health: number;
    hunger: number;
    happiness: number;
    sanity: number;
  };
  moralStats: {
    compassion: number;
    retribution: number;
    devotion: number;
    dominance: number;
    purity: number;
    ego: number;
  };
  dilemmas: Array<{
    _id: string;
    _creationTime: number;
    title: string;
    responseText: string;
    outcome?: string;
    updatedMoralStats?: Partial<{
      compassion: number;
      retribution: number;
      devotion: number;
      dominance: number;
      purity: number;
      ego: number;
    }>;
    updatedPersonality?: string;
    resolved: boolean;
    overridden?: boolean;
  }>;
}

// Generate a unique user ID for local storage
export function generateLocalUserId(): string {
  return 'local_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Get or create local user ID
export function getLocalUserId(): string {
  let userId = localStorage.getItem(LOCAL_USER_ID_KEY);
  if (!userId) {
    userId = generateLocalUserId();
    localStorage.setItem(LOCAL_USER_ID_KEY, userId);
  }
  return userId;
}

// Generate a fake ID for pets and dilemmas
function generateLocalId(): string {
  return 'local_' + Math.random().toString(36).substring(2);
}

// Pet management - simplified
export function getLocalPets(): SimplePet[] {
  try {
    const stored = localStorage.getItem(LOCAL_PETS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveLocalPets(pets: SimplePet[]): void {
  try {
    localStorage.setItem(LOCAL_PETS_KEY, JSON.stringify(pets));
  } catch (error) {
    console.error("Error saving pets:", error);
  }
}

export function createNewPet(name: string): SimplePet {
  const userId = getLocalUserId();
  const newPet: SimplePet = {
    _id: generateLocalId(),
    _creationTime: Date.now(),
    userId,
    name: name.trim(),
    age: 0,
    evolutionId: "base",
    personality: "Your pet is just beginning their journey...",
    baseStats: {
      health: 10,
      hunger: 10,
      happiness: 10,
      sanity: 10,
    },
    moralStats: DEFAULT_AVERAGE_STATS,
    dilemmas: []
  };

  const pets = getLocalPets();
  pets.push(newPet);
  saveLocalPets(pets);
  
  return newPet;
}

// Get the active pet (always the last one)
export function getActivePet(): SimplePet | null {
  const pets = getLocalPets();
  return pets.length > 0 ? pets[pets.length - 1] : null;
}

// Update a pet
export function updatePet(petId: string, updates: Partial<SimplePet>): void {
  const pets = getLocalPets();
  const petIndex = pets.findIndex(p => p._id === petId);
  if (petIndex >= 0) {
    pets[petIndex] = { ...pets[petIndex], ...updates };
    saveLocalPets(pets);
  }
}

// Add a dilemma to a pet
export function addDilemmaToPet(petId: string, dilemma: {
  title: string;
  responseText: string;
  outcome?: string;
  updatedMoralStats?: Partial<{
    compassion: number;
    retribution: number;
    devotion: number;
    dominance: number;
    purity: number;
    ego: number;
  }>;
  updatedPersonality?: string;
  resolved: boolean;
  overridden?: boolean;
}): void {
  const pets = getLocalPets();
  const petIndex = pets.findIndex(p => p._id === petId);
  if (petIndex >= 0) {
    const newDilemma = {
      _id: generateLocalId(),
      _creationTime: Date.now(),
      ...dilemma
    };
    pets[petIndex].dilemmas.push(newDilemma);
    saveLocalPets(pets);
  }
}

// Update a dilemma for a pet
export function updatePetDilemma(petId: string, dilemmaId: string, updates: Partial<{
  title: string;
  responseText: string;
  outcome?: string;
  updatedMoralStats?: Partial<{
    compassion: number;
    retribution: number;
    devotion: number;
    dominance: number;
    purity: number;
    ego: number;
  }>;
  updatedPersonality?: string;
  resolved: boolean;
  overridden?: boolean;
}>): void {
  const pets = getLocalPets();
  const petIndex = pets.findIndex(p => p._id === petId);
  if (petIndex >= 0) {
    const dilemmaIndex = pets[petIndex].dilemmas.findIndex(d => d._id === dilemmaId);
    if (dilemmaIndex >= 0) {
      pets[petIndex].dilemmas[dilemmaIndex] = { 
        ...pets[petIndex].dilemmas[dilemmaIndex], 
        ...updates 
      };
      saveLocalPets(pets);
    }
  }
}

// Achievement management
export function getLocalAchievements(): Array<{
  _id: string;
  _creationTime: number;
  userId: string;
  achievementId: AchievementId;
  timestamp: number;
}> {
  try {
    const stored = localStorage.getItem(LOCAL_ACHIEVEMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveLocalAchievement(achievementId: AchievementId): void {
  const achievements = getLocalAchievements();
  const userId = getLocalUserId();
  
  // Check if already exists
  if (achievements.some(a => a.achievementId === achievementId)) {
    return;
  }
  
  const newAchievement = {
    _id: generateLocalId(),
    _creationTime: Date.now(),
    userId,
    achievementId,
    timestamp: Date.now(),
  };
  
  achievements.push(newAchievement);
  localStorage.setItem(LOCAL_ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

// Clear all local data (for reset/debug)
export function clearAllLocalData(): void {
  localStorage.removeItem(LOCAL_USER_ID_KEY);
  localStorage.removeItem(LOCAL_PETS_KEY);
  localStorage.removeItem(LOCAL_ACHIEVEMENTS_KEY);
}

// Check if user has any pets
export function hasAnyPets(): boolean {
  return getLocalPets().length > 0;
} 