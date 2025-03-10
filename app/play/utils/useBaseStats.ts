import { BaseStatsType, PooType } from "@/constants/base";
import { GameState } from "@/convex/state";
import { Animation } from "@/constants/sprites";
import { useEffect, useReducer, useState, useCallback } from "react";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "@/components/Background";

const POO_STORAGE_KEY = "poos";

const DECREMENT_INTERVAL_MS = 5000;
const BASE_STATS_DECREMENT_VALUE = 1;
const MAX_POOS = 10;
const POO_CHANCE = 0.05;

function spawnPoo() {
  return {
    x: Math.random() * (VIEWPORT_WIDTH / 2) - VIEWPORT_WIDTH / 4,
    y: Math.random() * (VIEWPORT_HEIGHT / 6) + (VIEWPORT_HEIGHT * 4) / 21,
    id: Math.random(),
  };
}

// reducer actions for better state management
type StatsAction = 
  | { type: 'INIT_STATS'; payload: BaseStatsType }
  | { type: 'DECREMENT_STATS' }
  | { type: 'INCREMENT_STAT'; payload: { stat: keyof BaseStatsType; amount: number } }
  | { type: 'RESET_STATS' };

// reducer for base stats
function baseStatsReducer(state: BaseStatsType, action: StatsAction): BaseStatsType {
  switch (action.type) {
    case 'INIT_STATS':
      return action.payload;
    case 'DECREMENT_STATS':
      return {
        health: Math.max(0, state.health - BASE_STATS_DECREMENT_VALUE * Math.random()),
        hunger: Math.max(0, state.hunger - BASE_STATS_DECREMENT_VALUE * Math.random()),
        happiness: Math.max(0, state.happiness - BASE_STATS_DECREMENT_VALUE * Math.random()),
        sanity: Math.max(0, state.sanity - BASE_STATS_DECREMENT_VALUE * Math.random()),
      };
    case 'INCREMENT_STAT':
      return {
        ...state,
        [action.payload.stat]: Math.min(state[action.payload.stat] + action.payload.amount, 10),
      };
    case 'RESET_STATS':
      return {
        health: 0,
        hunger: 0,
        happiness: 0,
        sanity: 0,
      };
    default:
      return state;
  }
}

export function useBaseStats({
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
  
  // use reducer for base stats
  const [baseStats, dispatchBaseStats] = useReducer(baseStatsReducer, {
    health: 5,
    hunger: 5,
    happiness: 5,
    sanity: 5,
  });
  
  // track recent stat changes for animation
  const [recentDecrements, setRecentDecrements] = useState<Partial<Record<keyof BaseStatsType, number>>>({});
  const [recentIncrements, setRecentIncrements] = useState<Partial<Record<keyof BaseStatsType, number>>>({});

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
      dispatchBaseStats({ type: 'RESET_STATS' });
      setBaseStatsLoaded(true);
      return;
    }

    if (stateResult?.status === "has_dilemmas") {
      dispatchBaseStats({ type: 'INIT_STATS', payload: stateResult?.pet.baseStats });
      setBaseStatsLoaded(true);
    }
  }, [stateResult, rip]);

  useEffect(() => {
    const interval = setInterval(() => {
      // only decrement stats when page is focused
      if (!stateResult || stateResult.status === "graduated") return;

      // decrement stats
      const prevStats = { ...baseStats };
      dispatchBaseStats({ type: 'DECREMENT_STATS' });
      
      // calculate decrements for animation
      const newStats = baseStatsReducer(prevStats, { type: 'DECREMENT_STATS' });
      const decrements: Partial<Record<keyof BaseStatsType, number>> = {};
      
      Object.keys(newStats).forEach((key) => {
        const statKey = key as keyof BaseStatsType;
        const decrement = prevStats[statKey] - newStats[statKey];
        if (decrement > 0) {
          decrements[statKey] = parseFloat(decrement.toFixed(2));
        }
      });

      // set recent decrements for animation
      if (Object.keys(decrements).length > 0) {
        setRecentDecrements(decrements);
        // clear decrements after animation time
        setTimeout(() => {
          setRecentDecrements({});
        }, 2000);
      }

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
  }, [baseStatsLoaded, stateResult, setRip, baseStats]);

  const incrementStat = useCallback((stat: keyof BaseStatsType) => {
    // temporary happy animation
    setAnimation(Animation.HAPPY);
    setTimeout(() => {
      setAnimation(Animation.IDLE);
    }, 3000);

    // increment stat
    const incrementAmount = 3;
    dispatchBaseStats({ 
      type: 'INCREMENT_STAT', 
      payload: { stat, amount: incrementAmount } 
    });
    
    // track increment for animation
    const increments = { [stat]: incrementAmount };
    setRecentIncrements(increments);
    
    // clear increments after animation time
    setTimeout(() => {
      setRecentIncrements({});
    }, 2000);
  }, [setAnimation]);

  const cleanupPoo = useCallback((id: number) => {
    setPoos((prevPoos) => {
      const newPoos = prevPoos.filter((poo) => poo.id !== id);
      localStorage.setItem(POO_STORAGE_KEY, JSON.stringify(newPoos));
      return newPoos;
    });
  }, []);

  return {
    baseStats,
    incrementStat,
    poos,
    cleanupPoo,
    recentDecrements,
    recentIncrements,
  };
}
