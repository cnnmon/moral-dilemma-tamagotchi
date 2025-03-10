"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Window from "@/components/Window";
import { Achievement, achievements } from "@/constants/achievements";
import Image from "next/image";
import { getSprite, Animation } from "@/constants/sprites";
import { EvolutionId } from "@/constants/evolutions";

export default function AchievementsPage() {
  const userAchievements = useQuery(api.achievements.getUserAchievements);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const achievementsByCategory = {
    choice: Object.values(achievements).filter((a) => a.category === "choice"),
    evolution: Object.values(achievements).filter(
      (a) => a.category === "evolution"
    ),
    general: Object.values(achievements).filter(
      (a) => a.category === "general"
    ),
  };

  // function to check if an achievement is unlocked
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-5xl"
      >
        <Window
          title="achievements (╯°□°)╯"
          exitable
          setIsOpen={(isOpen: boolean) => {
            if (!isOpen) {
              window.location.href = "/play";
            }
          }}
        >
          <div className="mb-4 p-4">
            <div className="flex flex-col items-start gap-2">
              <p className="text-3xl font-bold">your collection</p>
              <p className="text-sm text-zinc-500 mb-4">
                {userAchievements?.length || 0} of{" "}
                {Object.keys(achievements).length} achievements unlocked
              </p>
            </div>

            {/* categories */}
            {Object.entries(achievementsByCategory).map(
              ([category, categoryAchievements]) => (
                <div key={category} className="mb-6">
                  <h2 className="text-md mb-2 capitalize">
                    {category} achievements
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {categoryAchievements.map((achievement) => {
                      const unlocked = isUnlocked(achievement.id);
                      const secret = achievement.secret && !unlocked;
                      const evolutionSprite = getEvolutionSprite(
                        achievement.id
                      );
                      return (
                        <div
                          key={achievement.id}
                          className={`border relative rounded-md p-3 h-30 ${
                            secret ? "cursor-not-allowed" : "cursor-pointer"
                          } transition-all 
                        ${unlocked ? "border-green-500 bg-green-500/10" : "border-zinc-300 bg-zinc-100/50"}`}
                          onClick={() => {
                            if (!secret) {
                              setSelectedAchievement(achievement);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="relative w-8 h-8 flex-shrink-0">
                              {!secret ? (
                                evolutionSprite && unlocked ? (
                                  <Image
                                    src={evolutionSprite}
                                    alt={achievement.title}
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                  />
                                ) : (
                                  <div className="w-8 h-8 flex items-center justify-center rounded-full">
                                    <span className="text-lg">
                                      {achievement.emoji}
                                    </span>
                                  </div>
                                )
                              ) : (
                                <div className="w-8 h-8 bg-zinc-300 flex items-center justify-center rounded-full">
                                  <span>?</span>
                                </div>
                              )}
                            </div>
                            <h3 className="text-sm font-medium">
                              {secret ? "???" : achievement.title}
                            </h3>
                          </div>
                          <p className="text-xs text-zinc-600">
                            {secret
                              ? "Unlock to discover"
                              : achievement.description}
                          </p>
                          {unlocked && (
                            <div className="absolute bottom-1 right-2 text-xs text-green-600">
                              unlocked {getUnlockDate(achievement.id)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </Window>
      </motion.div>

      {/* Achievement detail popup */}
      <AnimatePresence>
        {selectedAchievement && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl p-5 max-w-md w-full m-4"
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
                onClick={() => setSelectedAchievement(null)}
                className="w-full py-2 text-center border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
