import { useCallback, useEffect, useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AchievementId, getAchievement, getStage1EvolutionAchievementIds, getStage2EvolutionAchievementIds } from "@/constants/achievements";
import { EvolutionId } from "@/constants/evolutions";

const ACHIEVEMENTS_STORAGE_KEY = "achievements";
// don't use the shown achievements key in the hook, as we're managing this in the Play component
// const SHOWN_ACHIEVEMENTS_KEY = "shown_achievements";

// helper function to get achievement id for an evolution
function getAchievementForEvolution(evolutionId: EvolutionId): AchievementId | null {
  // skip for baby evolution
  if (evolutionId === "baby") return null;
  
  // split by underscore and take the first part if it contains underscores
  const cleanEvolutionId = evolutionId.split('_')[0];
  
  return `evolve_to_${cleanEvolutionId}` as AchievementId;
}

// helper function to check if unlocking an achievement should also unlock collection achievements
function checkCollectionAchievements(
  unlockedAchievementIds: AchievementId[],
  newAchievementId: AchievementId
): AchievementId[] {
  const result: AchievementId[] = [];
  
  // check if all stage 1 evolutions are unlocked
  const stage1Ids = getStage1EvolutionAchievementIds();
  const hasAllStage1 = stage1Ids.every(id => 
    unlockedAchievementIds.includes(id) || id === newAchievementId
  );
  
  if (hasAllStage1 && !unlockedAchievementIds.includes("collect_all_stage1")) {
    result.push("collect_all_stage1");
  }
  
  // check if all stage 2 evolutions are unlocked
  const stage2Ids = getStage2EvolutionAchievementIds();
  const hasAllStage2 = stage2Ids.every(id => 
    unlockedAchievementIds.includes(id) || id === newAchievementId
  );
  
  if (hasAllStage2 && !unlockedAchievementIds.includes("collect_all_stage2")) {
    result.push("collect_all_stage2");
  }
  
  // check if all evolutions are unlocked
  if (hasAllStage1 && hasAllStage2 && !unlockedAchievementIds.includes("collect_all")) {
    result.push("collect_all");
  }
  
  return result;
}

export function useAchievements(addOutcome: (text: string, exitable?: boolean) => void) {
  const userAchievements = useQuery(api.achievements.getUserAchievements);
  const unlockAchievement = useMutation(api.achievements.unlockAchievement);
  const stateResult = useQuery(api.state.getActiveGameState);
  const [achievements, setAchievements] = useState<AchievementId[]>([]);
  const [previousEvolutionId, setPreviousEvolutionId] = useState<EvolutionId | null>(null);

  // we're no longer tracking shown achievements here
  // const [shownAchievements, setShownAchievements] = useState<AchievementId[]>([]);
  // flag to track if this is initial load
  const isInitialLoad = useRef(true);

  // check for evolution achievements
  useEffect(() => {
    if (
      !stateResult ||
      stateResult.status === "not_authenticated" ||
      stateResult.status === "needs_pet" ||
      !userAchievements ||
      !stateResult.pet.evolutionId
    )
      return;

    const currentEvolutionId = stateResult.pet.evolutionId as EvolutionId;
    if (previousEvolutionId === null) {
      setPreviousEvolutionId(currentEvolutionId);
      return;
    }
    
    // Only process if evolution has changed
    if (previousEvolutionId !== currentEvolutionId) {
      const achievementId = getAchievementForEvolution(currentEvolutionId);
      if (achievementId) {
        // Check if the achievement is already unlocked
        const isAlreadyUnlocked = userAchievements.some(
          (a) => a.achievementId === achievementId
        );

        if (!isAlreadyUnlocked) {
          // Unlock the achievement
          unlockAchievement({ achievementId });

          // Show the achievement notification
          const achievement = getAchievement(achievementId);
          if (!achievement) {
            console.error(`Achievement ${achievementId} not found`);
            return;
          }
          addOutcome(
            `🏆 achievement unlocked: ${achievement.title} - ${achievement.description}`,
            true
          );

          // Check if this unlocks any collection achievements
          const unlockedAchievementIds = userAchievements.map(
            (a) => a.achievementId as AchievementId
          );
          const collectionAchievements = checkCollectionAchievements(
            unlockedAchievementIds,
            achievementId
          );

          // Unlock any collection achievements
          collectionAchievements.forEach((collectionId) => {
            // check if collection achievement is already unlocked
            const isCollectionAlreadyUnlocked = userAchievements.some(
              (a) => a.achievementId === collectionId
            );
            
            if (!isCollectionAlreadyUnlocked) {
              unlockAchievement({ achievementId: collectionId });
              const collectionAchievement = getAchievement(collectionId);
              addOutcome(
                `🏆 achievement unlocked: ${collectionAchievement.title} - ${collectionAchievement.description}`,
                true
              );
            }
          });
        }
      }

      // Update previous evolution ID
      setPreviousEvolutionId(currentEvolutionId);
    }
  }, [stateResult, userAchievements, unlockAchievement, addOutcome, previousEvolutionId]);

  // initialize achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
    
    // We've moved shown achievements management to the Play component
    // const savedShownAchievements = localStorage.getItem(SHOWN_ACHIEVEMENTS_KEY);
    // if (savedShownAchievements) {
    //   setShownAchievements(JSON.parse(savedShownAchievements));
    // }
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
      // We don't filter by shown achievements anymore, always show notifications for new achievements
      actuallyNewAchievements.forEach(achievementId => {
        const achievement = getAchievement(achievementId);
        addOutcome(`🏆 achievement unlocked: ${achievement.title} - ${achievement.description}`, true);
      });
    }
    
    // after first render, set initial load to false
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
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
    }
  }, [userAchievements, unlockAchievement, addOutcome]);
  
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