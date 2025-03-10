import { useCallback, useEffect, useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AchievementId, getAchievement } from "@/constants/achievements";

const ACHIEVEMENTS_STORAGE_KEY = "achievements";
const SHOWN_ACHIEVEMENTS_KEY = "shown_achievements";

export function useAchievements(addOutcome: (text: string, exitable?: boolean) => void) {
  const userAchievements = useQuery(api.achievements.getUserAchievements);
  const unlockAchievement = useMutation(api.achievements.unlockAchievement);
  const [achievements, setAchievements] = useState<AchievementId[]>([]);
  // track achievements that have already been shown to the user
  const [shownAchievements, setShownAchievements] = useState<AchievementId[]>([]);
  // flag to track if this is initial load
  const isInitialLoad = useRef(true);

  // initialize achievements and shown achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
    
    const savedShownAchievements = localStorage.getItem(SHOWN_ACHIEVEMENTS_KEY);
    if (savedShownAchievements) {
      setShownAchievements(JSON.parse(savedShownAchievements));
    }
  }, []);

  useEffect(() => {
    if (!userAchievements) return;
    
    const newAchievements = userAchievements.map(a => a.achievementId as AchievementId);
    
    // update local storage with all achievements
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(newAchievements));
    
    // find achievements that weren't in the previous state
    const actuallyNewAchievements = newAchievements.filter(
      achievementId => !achievements.includes(achievementId)
    );
    
    // only show toast for actually new achievements and not on initial load
    if (actuallyNewAchievements.length > 0 && !isInitialLoad.current) {
      const unshownAchievements = actuallyNewAchievements.filter(
        achievementId => !shownAchievements.includes(achievementId)
      );
      
      if (unshownAchievements.length > 0) {
        unshownAchievements.forEach(achievementId => {
          const achievement = getAchievement(achievementId);
          addOutcome(`🏆 achievement unlocked: ${achievement.title} - ${achievement.description}`, true);
        });
        
        // update shown achievements
        const updatedShownAchievements = [...shownAchievements, ...unshownAchievements];
        setShownAchievements(updatedShownAchievements);
        localStorage.setItem(SHOWN_ACHIEVEMENTS_KEY, JSON.stringify(updatedShownAchievements));
      }
    }
    
    // after first render, set initial load to false
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      
      // on first load, mark all current achievements as shown
      if (newAchievements.length > 0) {
        const updatedShownAchievements = [...new Set([...shownAchievements, ...newAchievements])];
        setShownAchievements(updatedShownAchievements);
        localStorage.setItem(SHOWN_ACHIEVEMENTS_KEY, JSON.stringify(updatedShownAchievements));
      }
    }
    
    // update state with all achievements
    setAchievements(newAchievements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAchievements]);

  const earnAchievement = useCallback(async (achievementId: AchievementId) => {
    const isAlreadyUnlocked = userAchievements?.some(
      a => a.achievementId === achievementId
    );
    if (isAlreadyUnlocked) return;
    await unlockAchievement({ achievementId });    
    if (addOutcome) {
      const achievement = getAchievement(achievementId);
      addOutcome(`🏆 achievement unlocked: ${achievement.title} - ${achievement.description}`, true);
      
      // immediately mark as shown to prevent duplicate notifications
      const updatedShownAchievements = [...shownAchievements, achievementId];
      setShownAchievements(updatedShownAchievements);
      localStorage.setItem(SHOWN_ACHIEVEMENTS_KEY, JSON.stringify(updatedShownAchievements));
    }
  }, [userAchievements, shownAchievements, unlockAchievement, addOutcome]);
  
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