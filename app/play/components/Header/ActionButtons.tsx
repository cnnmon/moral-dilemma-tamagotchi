import { motion } from "framer-motion";
import {
  useBaseStats,
  usePet,
  useHoverText,
  useDilemma,
  useOutcome,
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
        "flex justify-center items-center py-1 relative group transition-opacity duration-300 hover:bg-zinc-200",
        !disabled && "hover:bg-zinc-200",
      )}
      animate={{
        backgroundColor: hasWarning
          ? ["#ef4444", "#f87171", "#ef4444"]
          : undefined,
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
    alt: "heal (+health)",
    object: "bandaid" as ObjectKey,
    type: "cursor" as const,
    stat: "health" as keyof BaseStatsType,
  },
  {
    src: "/actions/feed.png",
    alt: "feed (+hunger)",
    object: "burger" as ObjectKey,
    type: "cursor" as const,
    stat: "hunger" as keyof BaseStatsType,
  },
  {
    src: "/actions/play.png",
    alt: "play (+happiness)",
    object: "ball" as ObjectKey,
    type: "cursor" as const,
    stat: "happiness" as keyof BaseStatsType,
  },
  {
    src: "/actions/talk.png",
    alt: "answer dilemma (+sanity)",
    object: "talk" as ObjectKey,
    type: "cursor" as const,
    stat: "sanity" as keyof BaseStatsType,
  },
];

export default function ActionButtons({
  onHealClick,
  onFeedClick,
  onPlayClick,
  onTalkClick,
}: {
  onHealClick?: () => void;
  onFeedClick?: () => void;
  onPlayClick?: () => void;
  onTalkClick?: () => void;
}) {
  const { incrementStat } = useBaseStats();
  const { pet, updatePet } = usePet();
  const { dilemma, setDilemma } = useDilemma();
  const { hideOutcome } = useOutcome();

  // Handle talk action - open existing dilemma or create a new one
  const handleTalkAction = useCallback(() => {
    if (!pet) return;

    if (dilemma) {
      onTalkClick?.();
      return;
    }

    const newDilemma = getRandomUnseenDilemma(pet);
    if (newDilemma) {
      const existing = pet.dilemmas.find((d) => d.id === newDilemma.id && !d.completed);
      if (!existing) {
        updatePet({ dilemmas: [...pet.dilemmas, { id: newDilemma.id, messages: [], completed: false }] });
      }
      setDilemma({
        ...newDilemma,
        messages: existing?.messages.length
          ? existing.messages
          : [{ role: "system", content: dilemmas[newDilemma.id].text.replaceAll("{pet}", pet.name) }],
      });
      hideOutcome();
      onTalkClick?.();
    } else {
      incrementStat(BaseStatKeys.sanity);
    }
  }, [dilemma, pet, updatePet, setDilemma, incrementStat, onTalkClick, hideOutcome]);

  if (!pet) {
    return null;
  }

  const hasRip = pet.evolutionIds.includes(EvolutionId.RIP);
  return (
    <div className="w-full border-2 border-black bg-zinc-100 h-fit">
      <div className="border-b-2 border-black px-2 py-1 text-lg">
        what do you do?
      </div>
      <div className="flex pointer-events-auto">
        {STAT_ACTIONS.map((action, index) => {
          return (
            <div
              key={action.stat}
              className={twMerge(
                "flex-1",
                index < STAT_ACTIONS.length - 1 ? "border-r-2" : "",
              )}
            >
              <ActionButton
                src={action.src}
                alt={action.alt}
                onClick={() => {
                  if (action.stat === "health") onHealClick?.();
                  else if (action.stat === "hunger") onFeedClick?.();
                  else if (action.stat === "happiness") onPlayClick?.();
                  else if (action.stat === "sanity") handleTalkAction();
                  else incrementStat(action.stat);
                }}
                disabled={hasRip}
                hasWarning={false} //value < 2}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
