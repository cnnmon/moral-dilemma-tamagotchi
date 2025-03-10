import { useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AchievementId, getAchievement } from "@/constants/achievements";

export function useAchievements(addOutcome?: (text: string, exitable?: boolean) => void) {
  const unlockAchievement = useMutation(api.achievements.unlockAchievement);
  const userAchievements = useQuery(api.achievements.getUserAchievements);
  
  const earnAchievement = useCallback(async (achievementId: AchievementId) => {
    // check if the achievement is already unlocked
    const isAlreadyUnlocked = userAchievements?.some(
      a => a.achievementId === achievementId
    );
    
    if (isAlreadyUnlocked) return;
    
    // unlock the achievement
    await unlockAchievement({ achievementId });
    
    // show achievement notification through outcomes
    if (addOutcome) {
      const achievement = getAchievement(achievementId);
      addOutcome(`🏆 achievement unlocked: ${achievement.title} - ${achievement.description}`, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAchievements]);
  
  // check if an achievement is unlocked
  const isAchievementUnlocked = useCallback((achievementId: AchievementId) => {
    if (!userAchievements) return false;
    return userAchievements.some(a => a.achievementId === achievementId);
  }, [userAchievements]);
  
  return {
    earnAchievement,
    userAchievements,
    isAchievementUnlocked
  };
} 