"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useReducer,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { getPets, Pet, savePet } from "@/app/storage/pet";
import { Animation } from "@/constants/sprites";
import {
  EvolutionIdType,
  getEvolution,
  Evolution,
} from "@/constants/evolutions";
import { ActiveDilemma } from "@/app/storage/pet";
import { BaseStatsType, PooType } from "@/constants/base";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "@/components/Background";

type Outcome = {
  type: "success" | "error";
  message: string;
  visible: boolean;
};

const POO_STORAGE_KEY = "poos";
const DECREMENT_INTERVAL_MS = 10000;
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
  | { type: "INIT_STATS"; payload: BaseStatsType }
  | { type: "DECREMENT_STATS" }
  | {
      type: "INCREMENT_STAT";
      payload: { stat: keyof BaseStatsType; amount: number };
    }
  | { type: "RESET_STATS" };

// reducer for base stats
function baseStatsReducer(
  state: BaseStatsType,
  action: StatsAction
): BaseStatsType {
  switch (action.type) {
    case "INIT_STATS":
      return action.payload;
    case "DECREMENT_STATS":
      // choose one stat to decrement randomly (except sanity)
      const statToDecrement =
        Object.keys(state)[
          Math.floor(Math.random() * Object.keys(state).length - 1)
        ];

      if (!statToDecrement) {
        return state;
      }

      // decrement that stat & sanity
      const newState = {
        ...state,
        [statToDecrement]: Math.max(
          0,
          state[statToDecrement as keyof BaseStatsType] -
            BASE_STATS_DECREMENT_VALUE * Math.random()
        ),
        sanity: Math.max(
          0,
          state.sanity - BASE_STATS_DECREMENT_VALUE * Math.random()
        ),
      };

      return newState;
    case "INCREMENT_STAT":
      return {
        ...state,
        [action.payload.stat]: Math.min(
          state[action.payload.stat] + action.payload.amount,
          10
        ),
      };
    case "RESET_STATS":
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

interface PetContextType {
  // Pet state
  pet: Pet | null;
  evolution: Evolution | null;
  rip: boolean;
  animation: Animation;
  setAnimation: (animation: Animation) => void;
  setRip: (rip: boolean) => void;
  updatePet: (updates: Partial<Pet>) => void;

  // Dilemma state
  dilemma: ActiveDilemma | null;
  setDilemma: (dilemma: ActiveDilemma | null) => void;

  // Outcome state
  outcome: Outcome | null;
  showOutcome: (
    type: "success" | "error",
    message: string,
    duration?: number
  ) => void;
  hideOutcome: () => void;

  // Base stats state
  baseStats: BaseStatsType;
  incrementStat: (stat: keyof BaseStatsType) => void;
  poos: PooType[];
  cleanupPoo: (id: number) => void;
  recentDecrements: Partial<Record<keyof BaseStatsType, number>>;
  recentIncrements: Partial<Record<keyof BaseStatsType, number>>;

  // Hover text state
  hoverText: string | null;
  setHoverText: (text: string | null) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: React.ReactNode }) {
  // Pet state from usePet
  const [pet, setPet] = useState<Pet | null>(null);
  const [animation, setAnimation] = useState<Animation>(Animation.IDLE);
  const [rip, setRip] = useState(false);
  const router = useRouter();

  // Dilemma state from useDilemma
  const [dilemma, setDilemma] = useState<ActiveDilemma | null>(null);

  // Outcome state
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // Hover text state
  const [hoverText, setHoverText] = useState<string | null>(null);

  // Base stats state from useBaseStats
  const [baseStatsLoaded, setBaseStatsLoaded] = useState(false);
  const [poos, setPoos] = useState<PooType[]>([]);
  const [baseStats, dispatchBaseStats] = useReducer(baseStatsReducer, {
    health: 5,
    hunger: 5,
    happiness: 5,
    sanity: 5,
  });
  const [recentDecrements, setRecentDecrements] = useState<
    Partial<Record<keyof BaseStatsType, number>>
  >({});
  const [recentIncrements, setRecentIncrements] = useState<
    Partial<Record<keyof BaseStatsType, number>>
  >({});

  const evolution = useMemo(
    () =>
      pet?.evolutionIds && pet.evolutionIds.length > 0
        ? getEvolution(
            pet.evolutionIds[pet.evolutionIds.length - 1] as EvolutionIdType
          )
        : null,
    [pet?.evolutionIds]
  );

  // Callback functions for base stats
  const incrementStat = useCallback((stat: keyof BaseStatsType) => {
    // temporary happy animation
    setAnimation(Animation.HAPPY);
    setTimeout(() => {
      setAnimation(Animation.IDLE);
    }, 3000);

    // increment stat
    const incrementAmount = 3;
    dispatchBaseStats({
      type: "INCREMENT_STAT",
      payload: { stat, amount: incrementAmount },
    });

    // track increment for animation
    const increments = { [stat]: incrementAmount };
    setRecentIncrements(increments);

    // clear increments after animation time
    setTimeout(() => {
      setRecentIncrements({});
    }, 2000);
  }, []);

  const cleanupPoo = useCallback((id: number) => {
    setPoos((prevPoos) => {
      const newPoos = prevPoos.filter((poo) => poo.id !== id);
      localStorage.setItem(POO_STORAGE_KEY, JSON.stringify(newPoos));
      return newPoos;
    });
  }, []);

  const updatePet = useCallback(
    (updates: Partial<Pet>) => {
      if (!pet) return;

      const updatedPet = { ...pet, ...updates };
      setPet(updatedPet);
      savePet(updatedPet);
    },
    [pet]
  );

  const showOutcome = useCallback(
    (type: "success" | "error", message: string) => {
      setOutcome({ type, message, visible: true });
    },
    []
  );

  const hideOutcome = useCallback(() => {
    setOutcome((prev) => (prev ? { ...prev, visible: false } : null));
    setTimeout(() => {
      setOutcome(null);
    }, 300);
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const pets = getPets();
        if (pets.length == 0) {
          window.location.href = "/create";
          return;
        }
        setPet(pets[0]);
      } catch (error) {
        console.error("Error loading pets:", error);
        window.location.href = "/create";
      }
    };
    fetchPets();
  }, [router]);

  // on mount, set the poos to saved poos
  useEffect(() => {
    const savedPoos = localStorage.getItem(POO_STORAGE_KEY);
    if (savedPoos) {
      setPoos(JSON.parse(savedPoos));
    }
  }, []);

  // on mount, set the base stats to saved base stats
  useEffect(() => {
    if (!pet || pet.age >= 2) return;

    if (rip) {
      dispatchBaseStats({ type: "RESET_STATS" });
      setBaseStatsLoaded(true);
      return;
    }

    dispatchBaseStats({ type: "INIT_STATS", payload: pet.baseStats });
    setBaseStatsLoaded(true);
  }, [pet, rip]);

  useEffect(() => {
    const interval = setInterval(() => {
      // only decrement stats when page is focused
      if (!pet || pet.age >= 2) return;

      // decrement stats
      const prevStats = { ...baseStats };
      dispatchBaseStats({ type: "DECREMENT_STATS" });

      // calculate decrements for animation
      const newStats = baseStatsReducer(prevStats, { type: "DECREMENT_STATS" });
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
  }, [baseStatsLoaded, pet, baseStats]);

  const contextValue: PetContextType = {
    pet,
    evolution,
    rip,
    animation,
    setAnimation,
    setRip,
    updatePet,
    dilemma,
    setDilemma,
    outcome,
    showOutcome,
    hideOutcome,
    baseStats,
    incrementStat,
    poos,
    cleanupPoo,
    recentDecrements,
    recentIncrements,
    hoverText,
    setHoverText,
  };

  return (
    <PetContext.Provider value={contextValue}>{children}</PetContext.Provider>
  );
}

export function usePet() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error("usePet must be used within a PetProvider");
  }

  return {
    pet: context.pet,
    evolution: context.evolution,
    rip: context.rip,
    animation: context.animation,
    setAnimation: context.setAnimation,
    setRip: context.setRip,
    updatePet: context.updatePet,
  };
}

export function useDilemma() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error("useDilemma must be used within a PetProvider");
  }

  return {
    dilemma: context.dilemma,
    setDilemma: context.setDilemma,
  };
}

export function useOutcome() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error("useOutcome must be used within a PetProvider");
  }

  return {
    outcome: context.outcome,
    showOutcome: context.showOutcome,
    hideOutcome: context.hideOutcome,
  };
}

export function useBaseStats() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error("useBaseStats must be used within a PetProvider");
  }

  return {
    baseStats: context.baseStats,
    incrementStat: context.incrementStat,
    poos: context.poos,
    cleanupPoo: context.cleanupPoo,
    recentDecrements: context.recentDecrements,
    recentIncrements: context.recentIncrements,
  };
}

export function useHoverText() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error("useHoverText must be used within a PetProvider");
  }

  return {
    hoverText: context.hoverText,
    setHoverText: context.setHoverText,
  };
}
