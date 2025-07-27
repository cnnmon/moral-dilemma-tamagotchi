import Stat from "./Stat";
import { motion } from "framer-motion";
import {
  useBaseStats,
  usePet,
  useHoverText,
} from "@/app/providers/PetProvider";
import { EvolutionId, getEvolutionTimeFrame } from "@/constants/evolutions";
import { ObjectKey } from "@/constants/objects";
import Image from "next/image";
import { memo, useCallback } from "react";
import { BaseStatsType } from "@/constants/base";
import { twMerge } from "tailwind-merge";

const WIDTH = 35;
const HEIGHT = 35;

const ActionButton = memo(function ActionButton({
  src,
  alt,
  onClick,
  disabled,
  hasWarning,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  disabled: boolean;
  hasWarning: boolean;
}) {
  const { setHoverText } = useHoverText();

  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick();
  }, [disabled, onClick]);

  return (
    <motion.div
      className={twMerge(
        "flex justify-center items-center w-14 h-11 group transition-opacity duration-300",
        !disabled && "hover:bg-zinc-200"
      )}
      animate={{
        backgroundColor: hasWarning
          ? ["#ef4444", "#f87171", "#ef4444"]
          : "#f4f4f5",
      }}
      transition={{
        duration: 1,
        repeat: hasWarning ? Infinity : 0,
        ease: "easeInOut",
      }}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={() => !disabled && setHoverText?.(alt)}
      onMouseLeave={() => !disabled && setHoverText?.(null)}
      onClick={handleClick}
    >
      <div className="relative">
        <Image
          className={`no-drag ${
            !disabled && "group-hover:scale-120 transition-all duration-300"
          }`}
          style={{
            opacity: disabled ? 0.5 : 1,
          }}
          src={src}
          alt={alt}
          width={WIDTH}
          height={HEIGHT}
        />
      </div>
    </motion.div>
  );
});

const STAT_ACTIONS = [
  {
    src: "/actions/heal.png",
    alt: "heal (+30 health)",
    object: "bandaid" as ObjectKey,
    type: "cursor" as const,
    stat: "health" as keyof BaseStatsType,
  },
  {
    src: "/actions/feed.png",
    alt: "feed (+30 hunger)",
    object: "burger" as ObjectKey,
    type: "cursor" as const,
    stat: "hunger" as keyof BaseStatsType,
  },
  {
    src: "/actions/play.png",
    alt: "play (+30 happiness)",
    object: "ball" as ObjectKey,
    type: "cursor" as const,
    stat: "happiness" as keyof BaseStatsType,
  },
  {
    src: "/actions/talk.png",
    alt: "talk (+30 sanity)",
    object: "talk" as ObjectKey,
    type: "cursor" as const,
    stat: "sanity" as keyof BaseStatsType,
  },
];

export default function ActionButtons() {
  const { baseStats, recentDecrements, recentIncrements, incrementStat } =
    useBaseStats();
  const { pet } = usePet();

  if (!pet) {
    return null;
  }

  const hasGraduated = pet.age >= getEvolutionTimeFrame(pet.age);
  const hasRip = pet.evolutionIds.includes(EvolutionId.RIP);

  return (
    <>
      {/* BaseStats with Action Buttons row */}
      <div className="flex flex-col items-start">
        {STAT_ACTIONS.map((action, index) => {
          const statKey = action.stat;
          const decrement = recentDecrements[statKey] ?? 0;
          const increment = recentIncrements[statKey] ?? 0;
          const value = baseStats[statKey];

          return (
            <div
              key={statKey}
              className="flex items-center gap-2 pointer-events-auto"
            >
              {/* Action button */}
              {!hasGraduated && !hasRip && (
                <div
                  className={twMerge(
                    "bg-zinc-100 border-r-2",
                    index < STAT_ACTIONS.length - 1
                      ? "border-b-2"
                      : "border-b-0"
                  )}
                >
                  <ActionButton
                    src={action.src}
                    alt={action.alt}
                    onClick={() => incrementStat(action.stat)}
                    disabled={hasRip}
                    hasWarning={value < 2}
                  />
                </div>
              )}

              {/* Stat display */}
              <Stat
                value={value * 10}
                displayValue={`${Math.round(value * 10)}%`}
                decrement={decrement}
                increment={increment}
                barStyle={{ width: "80px", height: "100x" }}
                disabled={hasGraduated}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
