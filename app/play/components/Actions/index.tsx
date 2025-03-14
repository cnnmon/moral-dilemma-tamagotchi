import { ObjectKey } from "@/constants/objects";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo } from "react";

const WIDTH = 35;
const HEIGHT = 35;

const ActionButton = memo(function ActionButton({
  src,
  alt,
  onClick,
  disabled,
  setHoverText,
  isLast,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  disabled: boolean;
  setHoverText: (text: string | null) => void;
  isLast: boolean;
}) {
  return (
    <div
      className={`flex justify-center items-center w-full sm:w-14 h-11 group transition-opacity duration-300 ${
        !disabled && "hover:bg-zinc-200"
      } ${isLast ? "border-0" : "border-r-2"}`}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={() => !disabled && setHoverText(alt)}
      onMouseLeave={() => !disabled && setHoverText(null)}
      onClick={() => !disabled && onClick()}
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
    </div>
  );
});

const ACTIONS = [
  {
    src: "/actions/heal.png",
    alt: "heal (+30 health)",
    object: "bandaid" as ObjectKey,
    type: "cursor",
  },
  {
    src: "/actions/feed.png",
    alt: "feed (+30 hunger)",
    object: "burger" as ObjectKey,
    type: "cursor",
  },
  {
    src: "/actions/play.png",
    alt: "play (+30 happiness)",
    object: "ball" as ObjectKey,
    type: "cursor",
  },
  {
    src: "/actions/talk.png",
    alt: "new dilemma! (+30 sanity)",
    type: "dilemma",
  },
];

export default function Actions({
  rip,
  setHoverText,
  setCursorObject,
  isProcessing,
  openDilemma,
}: {
  rip: boolean;
  setHoverText: (text: string | null) => void;
  setCursorObject: (object: ObjectKey | null) => void;
  openDilemma: () => void;
  isProcessing: boolean;
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
              ? setCursorObject(action.object as ObjectKey)
              : openDilemma()
          }
          setHoverText={setHoverText}
          isLast={index === ACTIONS.length - 1}
        />
      ))}
    </motion.div>
  );
}
