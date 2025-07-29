import { dilemmas } from "@/constants/dilemmas";
import { Pet, ActiveDilemma } from "@/app/storage/pet";
import { MoralDimensionsType } from "@/constants/morals";

// get a random unseen dilemma
export const getRandomUnseenDilemma = (pet: Pet): ActiveDilemma | null => {
  const seenDilemmas = pet.dilemmas.map((d) => d.id) || [];
  const unseenDilemmas = Object.keys(dilemmas).filter(
    (title) => !seenDilemmas.includes(title)
  );

  if (unseenDilemmas.length === 0) return null;

  const randomTitle = unseenDilemmas[Math.floor(Math.random() * unseenDilemmas.length)];
  return {
    id: randomTitle,
    messages: [],
    completed: false,
    stats: {
      compassion: 0,
      retribution: 0,
      devotion: 0,
      dominance: 0,
      purity: 0,
      ego: 0,
    },
  };
};

// Format moral stats changes for display
export const formatMoralStatsChange = (oldStats: MoralDimensionsType, newStats: MoralDimensionsType): string[] => {
  const changes: string[] = [];
  
  Object.entries(newStats).forEach(([key, newValue]) => {
    const oldValue = oldStats[key as keyof MoralDimensionsType];
    const diff = newValue - oldValue;
    
    if (Math.abs(diff) > 0.01) { // Only show significant changes
      const sign = diff > 0 ? "+" : "-";
      changes.push(`${sign}${key}`);
    }
  });
  
  return changes;
}; 