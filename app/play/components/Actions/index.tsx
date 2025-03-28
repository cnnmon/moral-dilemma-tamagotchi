import { ObjectKey } from "@/constants/objects";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo, useCallback } from "react";
import { BaseStatsType } from "@/constants/base";

const WIDTH = 35;
const HEIGHT = 35;

const ActionButton = memo(function ActionButton({
  src,
  alt,
  onClick,
  disabled,
  setHoverText,
  isLast,
  hasWarning,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  disabled: boolean;
  setHoverText: (text: string | null) => void;
  isLast: boolean;
  hasWarning: boolean;
  type: "cursor" | "dilemma";
}) {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick();
  }, [disabled, onClick]);

  return (
    <motion.div
      className={`flex justify-center items-center w-full sm:w-14 h-11 group transition-opacity duration-300 ${
        !disabled && "hover:bg-zinc-200"
      } ${isLast ? "border-0" : "border-r-2"}`}
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
      onMouseEnter={() => !disabled && setHoverText(alt)}
      onMouseLeave={() => !disabled && setHoverText(null)}
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

const ACTIONS = [
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
    alt: "new dilemma! (+30 sanity)",
    type: "dilemma" as const,
    stat: "sanity" as keyof BaseStatsType,
  },
];

export default function Actions({
  rip,
  setHoverText,
  isProcessing,
  openDilemma,
  baseStats,
  handleIncrementStat,
}: {
  rip: boolean;
  setHoverText: (text: string | null) => void;
  openDilemma: () => void;
  isProcessing: boolean;
  baseStats: BaseStatsType;
  handleIncrementStat: (stat: keyof BaseStatsType) => void;
}) {
  return (
    <motion.div
      key="actions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex h-fit border-2 bg-zinc-100"
    >
      {ACTIONS.map((action, index) => (
        <ActionButton
          key={action.src}
          src={action.src}
          alt={action.alt}
          disabled={rip || (action.type === "dilemma" && isProcessing)}
          onClick={() =>
            action.type === "cursor"
              ? handleIncrementStat(action.stat)
              : openDilemma()
          }
          setHoverText={setHoverText}
          isLast={index === ACTIONS.length - 1}
          hasWarning={baseStats[action.stat] < 2}
          type={action.type}
        />
      ))}
    </motion.div>
  );
}
