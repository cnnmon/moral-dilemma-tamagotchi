import { Stage1EvolutionId, Stage2EvolutionId, EvolutionIdEnum } from "./evolutions";

// achievement types
export type AchievementCategory = "choice" | "evolution" | "general";

export type AchievementId = 
  // choice achievements
  | "choose_omelette" 
  // evolution achievements - stage 1
  | `evolve_to_${Stage1EvolutionId}`
  // evolution achievements - stage 2
  | `evolve_to_${Stage2EvolutionId}`
  // collection achievements
  | "collect_all_stage1"
  | "collect_all_stage2"
  | "collect_all"
  // playtesting achievement
  | "playtester";

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  category: AchievementCategory;
  emoji: string; // emoji representation for the achievement
  rarity: "common" | "uncommon" | "rare" | "legendary";
  secret?: boolean; // whether the achievement is secret until unlocked
};

// helper function to create evolution achievements
const createEvolutionAchievement = (
  evolutionId: Stage1EvolutionId | Stage2EvolutionId, 
  stage: 1 | 2,
  title: string,
  description: string,
  emoji: string
): Achievement => ({
  id: `evolve_to_${evolutionId}` as AchievementId,
  title,
  description,
  category: "evolution",
  emoji,
  rarity: stage === 1 ? "common" : "uncommon",
  secret: true,
});

// define all achievements
export const achievements: Record<AchievementId, Achievement> = {
  // choice achievements
  choose_omelette: {
    id: "choose_omelette",
    title: "never skips breakfast",
    description: "you chose to make an omelette out of the egg. monster.",
    category: "choice",
    emoji: "🍳",
    rarity: "common",
  },
  
  // playtesting achievement
  playtester: {
    id: "playtester",
    title: "explorer",
    description: "thank you for playtesting this game!",
    category: "general",
    emoji: "🔍",
    rarity: "common",
  },
  
  // stage 1 evolutions
  evolve_to_empath: createEvolutionAchievement(EvolutionIdEnum.EMPATH, 1, "heart of gold", "your pet evolved into an empath", "❤️"),
  evolve_to_devout: createEvolutionAchievement(EvolutionIdEnum.DEVOUT, 1, "true believer", "your pet evolved into a devout", "🙏"),
  evolve_to_watcher: createEvolutionAchievement(EvolutionIdEnum.WATCHER, 1, "always watching", "your pet evolved into a watcher", "👁️"),
  evolve_to_soldier: createEvolutionAchievement(EvolutionIdEnum.SOLDIER, 1, "duty calls", "your pet evolved into a soldier", "⚔️"),
  evolve_to_hedonist: createEvolutionAchievement(EvolutionIdEnum.HEDONIST, 1, "pleasure seeker", "your pet evolved into a hedonist", "🎭"),
  ["evolve_to_teacher's pet"]: createEvolutionAchievement(EvolutionIdEnum.TEACHERSPET, 1, "number one student", "your pet evolved into a teacher's pet", "📚"),
  evolve_to_npc: createEvolutionAchievement(EvolutionIdEnum.NPC, 1, "background character", "your pet evolved into an NPC", "🤖"),

  // stage 2 evolutions
  evolve_to_gavel: createEvolutionAchievement(EvolutionIdEnum.GAVEL, 2, "judge, jury, executioner", "your pet evolved into a gavel", "⚖️"),
  evolve_to_vigilante: createEvolutionAchievement(EvolutionIdEnum.VIGILANTE, 2, "justice happens in the shadows", "your pet evolved into a vigilante", "🦹"),
  evolve_to_godfather: createEvolutionAchievement(EvolutionIdEnum.GODFATHER, 2, "head of the family", "your pet evolved into a godfather", "🤵"),
  evolve_to_guardian: createEvolutionAchievement(EvolutionIdEnum.GUARDIAN, 2, "sworn protector", "your pet evolved into a guardian", "🛡️"),
  evolve_to_aristocrat: createEvolutionAchievement(EvolutionIdEnum.ARISTOCRAT, 2, "nobleman", "your pet evolved into an aristocrat", "👸"),
  evolve_to_sigma: createEvolutionAchievement(EvolutionIdEnum.SIGMA, 2, "sigma rizz", "your pet evolved into a sigma", "🐺"),
  evolve_to_saint: createEvolutionAchievement(EvolutionIdEnum.SAINT, 2, "divine blessing", "your pet evolved into a saint", "😇"),
  evolve_to_cultleader: createEvolutionAchievement(EvolutionIdEnum.CULTLEADER, 2, "the enlightened one", "your pet evolved into a cult leader", "🧙"),
  
  // collection achievements
  collect_all_stage1: {
    id: "collect_all_stage1",
    title: "stage 1 collector",
    description: "you've experienced all stage 1 evolutions",
    category: "general",
    emoji: "🏆",
    rarity: "rare",
  },
  collect_all_stage2: {
    id: "collect_all_stage2",
    title: "stage 2 collector",
    description: "you've experienced all stage 2 evolutions",
    category: "general",
    emoji: "🏆",
    rarity: "rare",
  },
  collect_all: {
    id: "collect_all",
    title: "master collector",
    description: "you've experienced all possible evolutions",
    category: "general",
    emoji: "🌟",
    rarity: "legendary",
  },
};

// helper function to get achievement by ID
export function getAchievement(id: AchievementId): Achievement {
  return achievements[id];
}

// helper to get all stage 1 evolution achievement IDs
export function getStage1EvolutionAchievementIds(): AchievementId[] {
  return Object.keys(achievements).filter(id => 
    id.startsWith('evolve_to_') && !id.includes('gavel') && 
    !id.includes('vigilante') && !id.includes('godfather') && 
    !id.includes('guardian') && !id.includes('aristocrat') && 
    !id.includes('sigma') && !id.includes('saint') && 
    !id.includes('cultleader')
  ) as AchievementId[];
}

// helper to get all stage 2 evolution achievement IDs
export function getStage2EvolutionAchievementIds(): AchievementId[] {
  return Object.keys(achievements).filter(id => 
    id.startsWith('evolve_to_') && (
      id.includes('gavel') || id.includes('vigilante') || 
      id.includes('godfather') || id.includes('guardian') || 
      id.includes('aristocrat') || id.includes('sigma') || 
      id.includes('saint') || id.includes('cultleader')
    )
  ) as AchievementId[];
} 