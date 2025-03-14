import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AchievementId, getAchievement, getStage1EvolutionAchievementIds, getStage2EvolutionAchievementIds } from "@/constants/achievements";
import { EvolutionId } from "@/constants/evolutions";

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
  const [previousEvolutionId, setPreviousEvolutionId] = useState<EvolutionId | null>(null);

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
    
    if (previousEvolutionId !== currentEvolutionId) {
      const achievementId = getAchievementForEvolution(currentEvolutionId);
      if (achievementId) {
        const isAlreadyUnlocked = userAchievements.some(
          (a) => a.achievementId === achievementId
        );

        if (!isAlreadyUnlocked) {
          unlockAchievement({ achievementId });

          // show the achievement notification
          const achievement = getAchievement(achievementId);
          if (!achievement) {
            console.error(`Achievement ${achievementId} not found`);
            return;
          }
          addOutcome(
            `🏆 achievement unlocked: ${achievement.title} - ${achievement.description}`,
            true
          );

          // check if this unlocks any collection achievements
          const unlockedAchievementIds = userAchievements.map(
            (a) => a.achievementId as AchievementId
          );
          const collectionAchievements = checkCollectionAchievements(
            unlockedAchievementIds,
            achievementId
          );

          // unlock any collection achievements
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

      // update previous evolution id
      setPreviousEvolutionId(currentEvolutionId);
    }
  }, [stateResult, userAchievements, unlockAchievement, addOutcome, previousEvolutionId]);

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