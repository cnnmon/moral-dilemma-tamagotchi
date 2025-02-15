import { BaseStatsType, PooType } from "@/constants/base";
import { GameState } from "@/convex/state";
import { Animation } from "@/constants/sprites";
import { useEffect, useState } from "react";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "@/components/Background";

const POO_STORAGE_KEY = "poos";

const DECREMENT_INTERVAL_MS = 5000;
const BASE_STATS_DECREMENT_VALUE = 0.3;
const MAX_POOS = 10;
const POO_CHANCE = 0.05;

function spawnPoo() {
  return {
    x: Math.random() * (VIEWPORT_WIDTH / 2) - VIEWPORT_WIDTH / 4,
    y: Math.random() * (VIEWPORT_HEIGHT / 6) + (VIEWPORT_HEIGHT * 4) / 21,
    id: Math.random(),
  };
}

export default function useBaseStats({
  rip,
  stateResult,
  setAnimation,
  setRip,
}: {
  rip: boolean;
  stateResult: GameState | undefined;
  setAnimation: (animation: Animation) => void;
  setRip: (rip: boolean) => void;
}) {
  const [baseStatsLoaded, setBaseStatsLoaded] = useState(false);
  const [poos, setPoos] = useState<PooType[]>([]);
  const [baseStats, setBaseStats] = useState<BaseStatsType>({
    health: 5,
    hunger: 5,
    happiness: 5,
    sanity: 5,
  });

  // on mount, set the poos to saved poos
  useEffect(() => {
    const savedPoos = localStorage.getItem(POO_STORAGE_KEY);
    if (savedPoos) {
      setPoos(JSON.parse(savedPoos));
    }
  }, []);

  // on mount, set the base stats to saved base stats
  useEffect(() => {
    if (!stateResult || stateResult.status === "graduated") return;

    if (rip) {
      setBaseStats({
        health: 0,
        hunger: 0,
        happiness: 0,
        sanity: 0,
      });
      setBaseStatsLoaded(true);
      return;
    }

    if (stateResult?.status === "has_dilemmas") {
      setBaseStats(stateResult?.pet.baseStats);
      setBaseStatsLoaded(true);
    }
  }, [stateResult, rip]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!stateResult || stateResult.status === "graduated") return;

      // decrement stats
      setBaseStats((prevStats: BaseStatsType) => {
        const newStats = {
          health: Math.max(
            0,
            prevStats.health - BASE_STATS_DECREMENT_VALUE * Math.random()
          ),
          hunger: Math.max(
            0,
            prevStats.hunger - BASE_STATS_DECREMENT_VALUE * Math.random()
          ),
          happiness: Math.max(
            0,
            prevStats.happiness - BASE_STATS_DECREMENT_VALUE * Math.random()
          ),
          sanity: Math.max(
            0,
            prevStats.sanity - BASE_STATS_DECREMENT_VALUE * Math.random()
          ),
        };

        // check if any stat has reached zero -> game over
        if (
          newStats.health <= 0 ||
          newStats.hunger <= 0 ||
          newStats.happiness <= 0 ||
          newStats.sanity <= 0
        ) {
          clearInterval(interval);
          setRip(true);
        }

        return newStats;
      });

      // spawn poo
      setPoos((prevPoos) => {
        if (prevPoos.length < MAX_POOS && Math.random() < POO_CHANCE) {
          const newPoos = [...prevPoos, spawnPoo()];
          localStorage.setItem(POO_STORAGE_KEY, JSON.stringify(newPoos));
          return newPoos;
        }
        return prevPoos;
      });
    }, DECREMENT_INTERVAL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseStatsLoaded]);

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

  const cleanupPoo = (id: number) => {
    setPoos((prevPoos) => {
      const newPoos = prevPoos.filter((poo) => poo.id !== id);
      localStorage.setItem(POO_STORAGE_KEY, JSON.stringify(newPoos));
      return newPoos;
    });
  };

  return {
    baseStats,
    incrementStat,
    poos,
    cleanupPoo,
  };
}
