import { BaseStatsType } from "@/constants/base";
import { GameState } from "@/convex/state";
import { Animation } from "@/constants/sprites";
import { useEffect, useState } from "react";

const DECREMENT_INTERVAL_MS = 3000;
const BASE_STATS_DECREMENT_VALUE = 0.4;

export default function useBaseStats({
  stateResult,
  setAnimation,
  setRip,
}: {
  stateResult: GameState | undefined;
  setAnimation: (animation: Animation) => void;
  setRip: (rip: boolean) => void;
}) {
  const [baseStatsLoaded, setBaseStatsLoaded] = useState(false);
  const [baseStats, setBaseStats] = useState<BaseStatsType>({
    health: 5,
    hunger: 5,
    happiness: 5,
    sanity: 5,
  });

  // on mount, set the base stats to saved base stats
  useEffect(() => {
    if (!baseStatsLoaded && stateResult?.status === "has_dilemmas") {
      setBaseStats(stateResult?.pet.baseStats);
      setBaseStatsLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateResult]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBaseStats((prevStats: BaseStatsType) => {
        const newStats = {
          health: Math.max(0, prevStats.health - BASE_STATS_DECREMENT_VALUE * Math.random()),
          hunger: Math.max(0, prevStats.hunger - BASE_STATS_DECREMENT_VALUE * Math.random()),
          happiness: Math.max(0, prevStats.happiness - BASE_STATS_DECREMENT_VALUE * Math.random()),
          sanity: Math.max(0, prevStats.sanity - BASE_STATS_DECREMENT_VALUE * Math.random()),
        };

        // check if any stat has reached zero -> game over
        if (newStats.health <= 0 || newStats.hunger <= 0 || newStats.happiness <= 0 || newStats.sanity <= 0) {
          clearInterval(interval);
          setRip(true);
        }

        return newStats;
      });
    }, DECREMENT_INTERVAL_MS);

    return () => clearInterval(interval);

  }, [baseStatsLoaded]);

  const incrementSanity = () => {
    // no happy animation
    setBaseStats((prevStats: BaseStatsType) => ({
      ...prevStats,
      sanity: Math.min(prevStats.sanity + 3, 10),
    }));
  };

  const incrementStat = (stat: keyof BaseStatsType) => {
    // temporary happy animation
    setAnimation(Animation.HAPPY);
    setTimeout(() => {
      setAnimation(Animation.IDLE);
    }, 3000);

    // increment stat
    setBaseStats((prevStats: BaseStatsType) => ({
      ...prevStats,
      [stat]: Math.min(prevStats[stat] + 3, 10),
    }));
  };

  return {
    baseStats,
    incrementStat,
    incrementSanity,
  };
}