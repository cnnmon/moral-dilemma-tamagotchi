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

const AchievementCard = ({
  achievement,
  isUnlocked,
  isNew,
  onClick,
  getEvolutionSprite,
}: {
  achievement: Achievement;
  isUnlocked: boolean;
  isNew: boolean;
  onClick: () => void;
  getEvolutionSprite: (achievementId: string) => string | null;
}) => {
  const secret = achievement.secret && !isUnlocked;
  const evolutionSprite = getEvolutionSprite(achievement.id);

  return (
    <motion.div
      className={`border relative rounded-md p-2 ${
        secret ? "cursor-not-allowed" : "cursor-pointer"
      } transition-all 
      ${
        isUnlocked
          ? "border-green-500 bg-green-500/10"
          : "border-zinc-300 bg-zinc-100/50"
      }
      ${isNew ? "ring-2 ring-yellow-400" : ""}`}
      onClick={() => {
        if (!secret) {
          onClick();
        }
      }}
      animate={
        isNew && isUnlocked
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
            evolutionSprite && isUnlocked ? (
              <Image
                src={evolutionSprite}
                alt={achievement.title}
                width={24}
                height={24}
                className="object-contain"
              />
            ) : (
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-base">{achievement.emoji}</span>
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
        {isNew && isUnlocked && (
          <span className="text-xs ml-auto font-bold text-yellow-600">
            New!
          </span>
        )}
      </div>
    </motion.div>
  );
};

const AchievementPopup = ({
  achievement,
  isUnlocked,
  onClose,
  userAchievements,
  getEvolutionSprite,
}: {
  achievement: Achievement;
  isUnlocked: boolean;
  onClose: () => void;
  userAchievements: { achievementId: string; timestamp: number }[] | undefined;
  getEvolutionSprite: (achievementId: string) => string | null;
}) => {
  const evolutionSprite = getEvolutionSprite(achievement.id);
  const getUnlockDate = (id: string) => {
    if (!userAchievements) return null;
    const achievement = userAchievements.find((a) => a.achievementId === id);
    if (!achievement) return null;
    return new Date(achievement.timestamp).toLocaleDateString();
  };

  return (
    <motion.div
      className="fixed w-full h-full bg-black/50 flex items-center justify-center z-50 mt-[-100px]"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-md p-4 w-fit max-w-[280px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          {evolutionSprite && isUnlocked ? (
            <Image
              src={evolutionSprite}
              alt={achievement.title}
              width={48}
              height={48}
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
              <span className="text-2xl">{achievement.emoji}</span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-medium">{achievement.title}</h2>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  achievement.rarity === "legendary"
                    ? "bg-purple-100 text-purple-800"
                    : achievement.rarity === "rare"
                      ? "bg-blue-100 text-blue-800"
                      : achievement.rarity === "uncommon"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {achievement.rarity}
              </span>
              {isUnlocked && (
                <span className="text-xs text-green-600">
                  unlocked {getUnlockDate(achievement.id)}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="mb-4">{achievement.description}</p>
        <button
          onClick={onClose}
          className="w-full py-2 text-center border border-gray-300 rounded-md hover:bg-gray-50"
        >
          close
        </button>
      </motion.div>
    </motion.div>
  );
};

const AchievementTab = ({
  isOpen,
  isBlinking,
  newAchievementsCount,
  onMouseEnter,
  onMouseLeave,
}: {
  isOpen: boolean;
  isBlinking: boolean;
  newAchievementsCount: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => (
  <div
    className="fixed left-0 top-0 z-40 mt-20"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
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
        {newAchievementsCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {newAchievementsCount}
          </div>
        )}
      </div>
    </motion.div>
  </div>
);

// achievement sidebar content component
const AchievementSidebarContent = ({
  isOpen,
  userAchievements,
  newAchievements,
  onAchievementClick,
  isUnlocked,
  getEvolutionSprite,
}: {
  isOpen: boolean;
  userAchievements: { achievementId: string; timestamp: number }[] | undefined;
  newAchievements: AchievementId[];
  onAchievementClick: (achievement: Achievement) => void;
  isUnlocked: (id: string) => boolean;
  getEvolutionSprite: (achievementId: string) => string | null;
}) => {
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
    <motion.div
      className="fixed left-0 top-0 h-screen w-60 bg-white p-4 overflow-y-auto border-r-2 border-black z-30 absolute"
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

      {Object.entries(achievementsByCategory).map(
        ([category, categoryAchievements]) => (
          <div key={category} className="mb-4">
            <h2 className="text-sm mb-2 capitalize">{category}</h2>
            <div className="flex flex-col gap-2">
              {categoryAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={isUnlocked(achievement.id)}
                  isNew={newAchievements.includes(
                    achievement.id as AchievementId
                  )}
                  onClick={() => onAchievementClick(achievement)}
                  getEvolutionSprite={getEvolutionSprite}
                />
              ))}
            </div>
          </div>
        )
      )}
    </motion.div>
  );
};

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

    // only set new achievements if this is not the first load
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      if (unshownAchievements.length > 0) {
        onAchievementsSeen(unshownAchievements);
      }
    } else {
      setNewAchievements(unshownAchievements);
      // trigger 10sec blinking animation
      // when new achievements are detected
      if (unshownAchievements.length > 0) {
        setIsBlinking(true);
        if (blinkTimeoutRef.current) {
          clearTimeout(blinkTimeoutRef.current);
        }

        blinkTimeoutRef.current = setTimeout(() => {
          setIsBlinking(false);
        }, 10000);
      }
    }

    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
  }, [userAchievements, shownAchievements, onAchievementsSeen]);

  // handle opening the sidebar & mark achievements as seen
  const handleOpenSidebar = () => {
    setIsOpen(true);
    if (newAchievements.length > 0) {
      onAchievementsSeen(newAchievements);
    }
  };

  // only close the sidebar if no achievement is selected
  const handleMouseLeave = () => {
    if (!selectedAchievement) {
      setIsOpen(false);
    }
  };

  // check if an achievement is unlocked
  const isUnlocked = (id: string) => {
    if (!userAchievements) return false;
    return userAchievements.some((a) => a.achievementId === id);
  };

  // get evolution sprite if it exists
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

  return (
    <>
      <AchievementTab
        isOpen={isOpen}
        isBlinking={isBlinking}
        newAchievementsCount={newAchievements.length}
        onMouseEnter={handleOpenSidebar}
        onMouseLeave={handleMouseLeave}
      />

      <AchievementSidebarContent
        isOpen={isOpen}
        userAchievements={userAchievements}
        newAchievements={newAchievements}
        onAchievementClick={setSelectedAchievement}
        isUnlocked={isUnlocked}
        getEvolutionSprite={getEvolutionSprite}
      />

      <AnimatePresence>
        {selectedAchievement && (
          <AchievementPopup
            achievement={selectedAchievement}
            isUnlocked={isUnlocked(selectedAchievement.id)}
            onClose={() => setSelectedAchievement(null)}
            userAchievements={userAchievements}
            getEvolutionSprite={getEvolutionSprite}
          />
        )}
      </AnimatePresence>
    </>
  );
}
