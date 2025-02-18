import { ObjectKey } from "@/constants/objects";
import { motion } from "framer-motion";
import Image from "next/image";
import { memo } from "react";

const WIDTH = 40;
const HEIGHT = 40;

const ActionButton = memo(function ActionButton({
  src,
  alt,
  onClick,
  disabled,
  setHoverText,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  disabled: boolean;
  setHoverText: (text: string | null) => void;
}) {
  return (
    <div
      className="flex justify-center items-center w-full md:w-13 h-13 p-2 group"
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={() => !disabled && setHoverText(alt)}
      onMouseLeave={() => !disabled && setHoverText(null)}
      onClick={() => !disabled && onClick()}
    >
      <Image
        className={`no-drag ${
          !disabled && "group-hover:scale-110 transition-all duration-300"
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
    alt: "+ health",
    object: "bandaid" as ObjectKey,
    type: "cursor",
  },
  {
    src: "/actions/feed.png",
    alt: "+ hunger",
    object: "burger" as ObjectKey,
    type: "cursor",
  },
  {
    src: "/actions/play.png",
    alt: "+ happiness",
    object: "ball" as ObjectKey,
    type: "cursor",
  },
  {
    src: "/actions/talk.png",
    alt: "+ sanity",
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
      className="flex flex-row items-center z-10 border-2 bg-zinc-100 md:flex-col justify-between"
    >
      {ACTIONS.map((action) => (
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
        />
      ))}
    </motion.div>
  );
}
