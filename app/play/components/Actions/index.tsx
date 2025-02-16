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
      className="flex w-full items-center justify-center p-2 transition-all duration-300 mt-[-2px] ml-[-2px] hover:scale-110"
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseEnter={() => !disabled && setHoverText(alt)}
      onMouseLeave={() => !disabled && setHoverText(null)}
      onClick={() => !disabled && onClick()}
    >
      <Image
        className="no-drag"
        src={src}
        alt={alt}
        width={WIDTH}
        height={HEIGHT}
      />
    </div>
  );
});

const HealButton = memo(function HealButton({
  rip,
  setHoverText,
  setCursorObject,
}: {
  rip: boolean;
  setHoverText: (text: string | null) => void;
  setCursorObject: (object: ObjectKey | null) => void;
}) {
  return (
    <ActionButton
      src="/actions/heal.png"
      alt="+ health"
      disabled={rip}
      onClick={() => setCursorObject("bandaid")}
      setHoverText={setHoverText}
    />
  );
});

const FeedButton = memo(function FeedButton({
  rip,
  setHoverText,
  setCursorObject,
}: {
  rip: boolean;
  setHoverText: (text: string | null) => void;
  setCursorObject: (object: ObjectKey | null) => void;
}) {
  return (
    <ActionButton
      src="/actions/feed.png"
      alt="+ hunger"
      disabled={rip}
      onClick={() => setCursorObject("burger")}
      setHoverText={setHoverText}
    />
  );
});

const PlayButton = memo(function PlayButton({
  rip,
  setHoverText,
  setCursorObject,
}: {
  rip: boolean;
  setHoverText: (text: string | null) => void;
  setCursorObject: (object: ObjectKey | null) => void;
}) {
  return (
    <ActionButton
      src="/actions/play.png"
      alt="+ happiness"
      disabled={rip}
      onClick={() => setCursorObject("ball")}
      setHoverText={setHoverText}
    />
  );
});

const TalkButton = memo(function TalkButton({
  rip,
  isProcessing,
  setHoverText,
  openDilemma,
}: {
  rip: boolean;
  isProcessing: boolean;
  setHoverText: (text: string | null) => void;
  openDilemma: () => void;
}) {
  return (
    <ActionButton
      src="/actions/talk.png"
      alt="+ sanity"
      disabled={rip || isProcessing}
      onClick={openDilemma}
      setHoverText={setHoverText}
    />
  );
});

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
    <div className="flex w-full border-2">
      <motion.div
        key="actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex w-full"
      >
        <HealButton
          rip={rip}
          setHoverText={setHoverText}
          setCursorObject={setCursorObject}
        />
        <FeedButton
          rip={rip}
          setHoverText={setHoverText}
          setCursorObject={setCursorObject}
        />
        <PlayButton
          rip={rip}
          setHoverText={setHoverText}
          setCursorObject={setCursorObject}
        />
        <TalkButton
          rip={rip}
          isProcessing={isProcessing}
          setHoverText={setHoverText}
          openDilemma={openDilemma}
        />
      </motion.div>
    </div>
  );
}
