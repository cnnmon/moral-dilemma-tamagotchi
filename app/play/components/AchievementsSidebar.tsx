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
import Window from "@/components/Window";

interface AchievementsSidebarProps {
  userAchievements: { achievementId: string; timestamp: number }[] | undefined;
  shownAchievements: AchievementId[];
  onAchievementsSeen: (ids: AchievementId[]) => void;
}

const AchievementCard = ({
  achievement,
  isCompleted,
  isNew,
  onClick,
  getEvolutionSprite,
}: {
  achievement: Achievement;
  isCompleted: boolean;
  isNew: boolean;
  onClick: () => void;
  getEvolutionSprite: (achievementId: string) => string | null;
}) => {
  const secret = achievement.secret && !isCompleted;
  const evolutionSprite = getEvolutionSprite(achievement.id);

  return (
    <motion.div
      className={`border relative rounded-md p-2 ${
        secret ? "cursor-not-allowed" : "cursor-pointer"
      } transition-all 
      ${
        isCompleted
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
        isNew && isCompleted
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
            evolutionSprite && isCompleted ? (
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
        {isNew && isCompleted && (
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
  isCompleted,
  onClose,
  userAchievements,
  getEvolutionSprite,
}: {
  achievement: Achievement;
  isCompleted: boolean;
  onClose: () => void;
  userAchievements: { achievementId: string; timestamp: number }[] | undefined;
  getEvolutionSprite: (achievementId: string) => string | null;
}) => {
  const getCompletionDate = (id: string) => {
    if (!userAchievements) return null;
    const achievement = userAchievements.find((a) => a.achievementId === id);
    if (!achievement) return null;
    return new Date(achievement.timestamp).toLocaleDateString();
  };

  const evolutionSprite = getEvolutionSprite(achievement.id);
  const completionDate = getCompletionDate(achievement.id);

  return (
    <div
      className="fixed inset-0 p-2 sm:p-0 flex items-center justify-center z-50 pointer-events-none"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="max-w-lg pointer-events-auto">
        <Window
          title={`${isCompleted ? "[completed!]" : ""} ${achievement.title}`}
          isOpen={true}
          setIsOpen={() => onClose()}
        >
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-3 pt-2 px-2">
            <div className="border-2 p-4 w-36 h-36 sm:w-auto sm:h-auto flex items-center justify-center bg-white">
              {evolutionSprite && isCompleted ? (
                <Image
                  src={evolutionSprite}
                  alt={achievement.title}
                  width={140}
                  height={140}
                />
              ) : (
                <div className="w-18 h-18 flex items-center justify-center rounded-full bg-gray-100">
                  <span className="text-2xl">{achievement.emoji}</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-bold">{achievement.title}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    achievement.rarity === "legendary"
                      ? "bg-purple-200 text-purple-800"
                      : achievement.rarity === "rare"
                        ? "bg-blue-200 text-blue-800"
                        : achievement.rarity === "uncommon"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {achievement.rarity}
                </span>
                {isCompleted && (
                  <span className="text-xs text-green-600">
                    completed {completionDate}
                  </span>
                )}
              </div>
              <p>{achievement.description}</p>
            </div>
          </div>
        </Window>
      </div>
    </div>
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
  isCompleted,
  getEvolutionSprite,
  onMouseEnter,
  onMouseLeave,
}: {
  isOpen: boolean;
  userAchievements: { achievementId: string; timestamp: number }[] | undefined;
  newAchievements: AchievementId[];
  onAchievementClick: (achievement: Achievement) => void;
  isCompleted: (id: string) => boolean;
  getEvolutionSprite: (achievementId: string) => string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
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
    <div className="z-30">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20"
            onClick={onMouseLeave}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      <motion.div
        className="fixed left-0 top-0 h-screen w-60 bg-white overflow-y-auto border-r-2 border-black pointer-events-auto"
        initial={{ x: -240 }}
        animate={{ x: isOpen ? 0 : -240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseEnter={onMouseEnter}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
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
                      isCompleted={isCompleted(achievement.id)}
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
        </div>
      </motion.div>
    </div>
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

  // handle closing the sidebar
  const handleCloseSidebar = () => {
    // don't close if there's a popup open
    if (!selectedAchievement) {
      setIsOpen(false);
    }
  };

  // check if an achievement is completed
  const isCompleted = (id: string) => {
    if (!userAchievements) return false;
    return userAchievements.some((a) => a.achievementId === id);
  };

  // get evolution sprite if it exists
  const getEvolutionSprite = (achievementId: string) => {
    if (!achievementId.startsWith("evolve_to_")) return null;
    const evolutionId = achievementId.replace("evolve_to_", "");
    try {
      return getSprite(Animation.IDLE, evolutionId as EvolutionId);
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
        onMouseLeave={handleCloseSidebar}
      />

      <AchievementSidebarContent
        isOpen={isOpen}
        userAchievements={userAchievements}
        newAchievements={newAchievements}
        onAchievementClick={setSelectedAchievement}
        isCompleted={isCompleted}
        getEvolutionSprite={getEvolutionSprite}
        onMouseEnter={handleOpenSidebar}
        onMouseLeave={handleCloseSidebar}
      />

      <AnimatePresence>
        {selectedAchievement && (
          <AchievementPopup
            achievement={selectedAchievement}
            isCompleted={isCompleted(selectedAchievement.id)}
            onClose={() => setSelectedAchievement(null)}
            userAchievements={userAchievements}
            getEvolutionSprite={getEvolutionSprite}
          />
        )}
      </AnimatePresence>
    </>
  );
}
