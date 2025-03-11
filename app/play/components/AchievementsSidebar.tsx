"use client";

import { useState, useEffect, useRef } from "react";
import {
  Achievement,
  achievements,
  AchievementId,
} from "@/constants/achievements";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { getSprite, Animation } from "@/constants/sprites";
import { EvolutionId } from "@/constants/evolutions";

interface AchievementsSidebarProps {
  userAchievements: { achievementId: string; timestamp: number }[] | undefined;
  shownAchievements: AchievementId[];
  onAchievementsSeen: (ids: AchievementId[]) => void;
}

export default function AchievementsSidebar({
  userAchievements,
  shownAchievements,
  onAchievementsSeen,
}: AchievementsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [newAchievements, setNewAchievements] = useState<AchievementId[]>([]);
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track if this is the initial load
  const initialLoadRef = useRef(true);

  // track if there are any unread achievements
  useEffect(() => {
    if (!userAchievements) return;

    const achievementIds = userAchievements.map(
      (a) => a.achievementId as AchievementId
    );
    const unshownAchievements = achievementIds.filter(
      (id) => !shownAchievements.includes(id)
    );

    // only set new achievements if this is not the initial load
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      // mark initial achievements as seen
      if (unshownAchievements.length > 0) {
        onAchievementsSeen(unshownAchievements);
      }
    } else {
      setNewAchievements(unshownAchievements);

      // trigger blinking animation when new achievements are detected
      if (unshownAchievements.length > 0) {
        setIsBlinking(true);

        // clear previous timeout if it exists
        if (blinkTimeoutRef.current) {
          clearTimeout(blinkTimeoutRef.current);
        }

        // stop blinking after 10 seconds
        blinkTimeoutRef.current = setTimeout(() => {
          setIsBlinking(false);
        }, 10000);
      }
    }

    // cleanup timeout on unmount
    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
  }, [userAchievements, shownAchievements, onAchievementsSeen]);

  // handle opening the sidebar, also mark achievements as seen
  const handleOpenSidebar = () => {
    setIsOpen(true);

    // mark all new achievements as seen when opening the sidebar
    if (newAchievements.length > 0) {
      onAchievementsSeen(newAchievements);
    }
  };

  // handle closing the achievement popup
  const closeAchievementPopup = () => {
    setSelectedAchievement(null);
  };

  // handle mouse leave for the sidebar
  const handleMouseLeave = () => {
    // only close the sidebar if no achievement is selected
    if (!selectedAchievement) {
      setIsOpen(false);
    }
  };

  // check if an achievement is unlocked
  const isUnlocked = (id: string) => {
    if (!userAchievements) return false;
    return userAchievements.some((a) => a.achievementId === id);
  };

  // function to get unlock date
  const getUnlockDate = (id: string) => {
    if (!userAchievements) return null;
    const achievement = userAchievements.find((a) => a.achievementId === id);
    if (!achievement) return null;
    return new Date(achievement.timestamp).toLocaleDateString();
  };

  // function to get evolution sprite if it exists
  const getEvolutionSprite = (achievementId: string) => {
    if (!achievementId.startsWith("evolve_to_")) return null;
    const evolutionId = achievementId.replace("evolve_to_", "");
    const age = [
      "gavel",
      "vigilante",
      "godfather",
      "guardian",
      "aristocrat",
      "sigma",
      "saint",
      "cultleader",
    ].includes(evolutionId)
      ? 2
      : 1;
    try {
      return getSprite(age, Animation.IDLE, evolutionId as EvolutionId);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const achievementsByCategory = {
    choice: Object.values(achievements)
      .filter((a) => a.category === "choice")
      .filter(
        (a, index, self) => index === self.findIndex((t) => t.id === a.id)
      ),
    evolution: Object.values(achievements)
      .filter((a) => a.category === "evolution")
      .filter(
        (a, index, self) => index === self.findIndex((t) => t.id === a.id)
      ),
    general: Object.values(achievements)
      .filter((a) => a.category === "general")
      .filter(
        (a, index, self) => index === self.findIndex((t) => t.id === a.id)
      ),
  };

  return (
    <>
      {/* floating sidebar tab */}
      <div
        className="fixed left-0 top-0 z-40 mt-20"
        onMouseEnter={handleOpenSidebar}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative flex items-center"
          animate={{ x: isOpen ? 240 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div
            className={`bg-white border-r-2 border-t-2 border-b-2 border-black py-4 px-2 cursor-pointer flex flex-col items-center justify-center ${
              isBlinking ? "animate-pulse" : ""
            }`}
          >
            <span className="text-xl">🏆</span>
            {newAchievements.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {newAchievements.length}
              </div>
            )}
          </div>
        </motion.div>

        {/* sidebar content */}
        <motion.div
          className="fixed left-0 top-0 h-screen w-60 bg-white p-4 overflow-y-auto border-r-2 border-black"
          initial={{ x: -240 }}
          animate={{ x: isOpen ? 0 : -240 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="mb-4">
            <div className="flex flex-col items-start gap-2">
              <p className="text-xl font-bold">achievements</p>
              <p className="text-xs text-zinc-500">
                {userAchievements
                  ? new Set(userAchievements.map((a) => a.achievementId)).size
                  : 0}{" "}
                of 20 unlocked
              </p>
            </div>
          </div>

          {/* categories */}
          {Object.entries(achievementsByCategory).map(
            ([category, categoryAchievements]) => (
              <div key={category} className="mb-4">
                <h2 className="text-sm mb-2 capitalize">{category}</h2>
                <div className="flex flex-col gap-2">
                  {categoryAchievements.map((achievement) => {
                    const unlocked = isUnlocked(achievement.id);
                    const secret = achievement.secret && !unlocked;
                    const evolutionSprite = getEvolutionSprite(achievement.id);
                    const isNew = newAchievements.includes(
                      achievement.id as AchievementId
                    );

                    return (
                      <motion.div
                        key={achievement.id}
                        className={`border relative rounded-md p-2 ${
                          secret ? "cursor-not-allowed" : "cursor-pointer"
                        } transition-all 
                        ${
                          unlocked
                            ? "border-green-500 bg-green-500/10"
                            : "border-zinc-300 bg-zinc-100/50"
                        }
                        ${isNew ? "ring-2 ring-yellow-400" : ""}`}
                        onClick={() => {
                          if (!secret) {
                            setSelectedAchievement(achievement);
                          }
                        }}
                        // add animation for new achievements
                        animate={
                          isNew && unlocked
                            ? {
                                scale: [1, 1.03, 1],
                                transition: {
                                  repeat: Infinity,
                                  repeatType: "reverse",
                                  duration: 0.8,
                                },
                              }
                            : {}
                        }
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative w-6 h-6 flex-shrink-0">
                            {!secret ? (
                              evolutionSprite && unlocked ? (
                                <Image
                                  src={evolutionSprite}
                                  alt={achievement.title}
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                />
                              ) : (
                                <div className="w-6 h-6 flex items-center justify-center">
                                  <span className="text-base">
                                    {achievement.emoji}
                                  </span>
                                </div>
                              )
                            ) : (
                              <div className="w-6 h-6 bg-zinc-300 flex items-center justify-center rounded-full">
                                <span>?</span>
                              </div>
                            )}
                          </div>
                          <h3 className="text-xs font-medium">
                            {secret ? "???" : achievement.title}
                          </h3>
                          {isNew && unlocked && (
                            <span className="text-xs ml-auto font-bold text-yellow-600">
                              New!
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </motion.div>
      </div>

      {/* Achievement detail popup */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={closeAchievementPopup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-md p-5 max-w-md w-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-3">
                {getEvolutionSprite(selectedAchievement.id) &&
                isUnlocked(selectedAchievement.id) ? (
                  <Image
                    src={getEvolutionSprite(selectedAchievement.id) || ""}
                    alt={selectedAchievement.title}
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
                    <span className="text-2xl">
                      {selectedAchievement.emoji}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-medium">
                    {selectedAchievement.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedAchievement.rarity === "legendary"
                          ? "bg-purple-100 text-purple-800"
                          : selectedAchievement.rarity === "rare"
                            ? "bg-blue-100 text-blue-800"
                            : selectedAchievement.rarity === "uncommon"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedAchievement.rarity}
                    </span>
                    {isUnlocked(selectedAchievement.id) && (
                      <span className="text-xs text-green-600">
                        unlocked {getUnlockDate(selectedAchievement.id)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="mb-4">{selectedAchievement.description}</p>
              <button
                onClick={closeAchievementPopup}
                className="w-full py-2 text-center border border-gray-300 rounded-md hover:bg-gray-50"
              >
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
