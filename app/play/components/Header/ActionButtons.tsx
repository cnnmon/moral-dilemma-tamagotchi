import { motion } from "framer-motion";
import {
  useBaseStats,
  usePet,
  useHoverText,
  useDilemma,
} from "@/app/providers/PetProvider";
import { EvolutionId } from "@/constants/evolutions";
import { ObjectKey } from "@/constants/objects";
import { getRandomUnseenDilemma } from "@/app/utils/dilemma";
import Image from "next/image";
import { memo, useCallback } from "react";
import { BaseStatsType, BaseStatKeys } from "@/constants/base";
import { twMerge } from "tailwind-merge";
import { dilemmas } from "@/constants/dilemmas";

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
        "flex justify-center items-center relative w-14 h-full group transition-opacity duration-300",
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

export default function ActionButtons({
  onHealClick,
  onPlayClick,
}: {
  onHealClick?: () => void;
  onPlayClick?: () => void;
}) {
  const { baseStats, incrementStat } = useBaseStats();
  const { pet } = usePet();
  const { dilemma, setDilemma } = useDilemma();

  // Handle talk action - create new dilemma only if none exists
  const handleTalkAction = useCallback(() => {
    if (dilemma || !pet) {
      return;
    }

    const newDilemma = getRandomUnseenDilemma(pet);
    if (newDilemma) {
      setDilemma({
        ...newDilemma,
        messages: [
          {
            role: "system",
            content: dilemmas[newDilemma.id].text.replaceAll("{pet}", pet.name),
          },
        ],
      });
    } else {
      incrementStat(BaseStatKeys.sanity);
    }
  }, [dilemma, pet, setDilemma, incrementStat]);

  if (!pet) {
    return null;
  }

  const hasRip = pet.evolutionIds.includes(EvolutionId.RIP);
  return (
    <div className="flex flex-col items-start w-full h-full">
      {STAT_ACTIONS.map((action, index) => {
        const statKey = action.stat;
        const value = baseStats[statKey];

        return (
          <div
            key={statKey}
            className="flex items-center pointer-events-auto w-full h-full"
          >
            {/* Action button */}
            <div
              className={twMerge(
                "bg-zinc-100 border-r-2 h-full",
                index < STAT_ACTIONS.length - 1 ? "border-b-2" : "border-b-0"
              )}
            >
              <ActionButton
                src={action.src}
                alt={action.alt}
                onClick={() => {
                  if (action.stat === "health") {
                    onHealClick?.();
                  } else if (action.stat === "happiness") {
                    onPlayClick?.();
                  } else if (action.stat === "sanity") {
                    handleTalkAction();
                  } else {
                    incrementStat(action.stat);
                  }
                }}
                disabled={hasRip}
                hasWarning={value < 2}
              />
            </div>

            {/* Stat display */}
            <div className="flex w-full h-full relative">
              <div
                className={twMerge(
                  "w-full h-full",
                  index < STAT_ACTIONS.length - 1 ? "border-b-2" : "border-b-0"
                )}
              >
                <div
                  className="bg-zinc-500 h-full"
                  style={{ width: `${value * 10}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-center w-10 h-full absolute right-0">
                <p className="text-zinc-700">{Math.round(value * 10)}%</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
