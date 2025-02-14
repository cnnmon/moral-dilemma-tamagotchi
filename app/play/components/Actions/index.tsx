import { ObjectKey } from "@/constants/objects";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";

const WIDTH = 40;
const HEIGHT = 40;

export default function Actions({
  rip,
  setHoverText,
  setCursorObject,
  openDilemma,
}: {
  rip: boolean;
  setHoverText: (text: string | null) => void;
  setCursorObject: (object: ObjectKey | null) => void;
  openDilemma: () => void;
}) {
  const ActionButton = useMemo(
    () =>
      function ActionButton({
        src,
        alt,
        onClick,
        disabled,
      }: {
        src: string;
        alt: string;
        onClick: () => void;
        disabled: boolean;
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
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="flex w-full border-2">
      <motion.div
        key="actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex w-full"
      >
        <ActionButton
          src="/actions/heal.png"
          alt="heal"
          disabled={rip}
          onClick={() => {
            setCursorObject("bandaid");
          }}
        />
        <ActionButton
          src="/actions/feed.png"
          alt="feed"
          disabled={rip}
          onClick={() => {
            setCursorObject("burger");
          }}
        />
        <ActionButton
          src="/actions/play.png"
          alt="play"
          disabled={rip}
          onClick={() => {
            setCursorObject("ball");
          }}
        />
        <ActionButton
          src="/actions/talk.png"
          alt="talk"
          disabled={rip}
          onClick={() => openDilemma()}
        />
      </motion.div>
    </div>
  );
}
