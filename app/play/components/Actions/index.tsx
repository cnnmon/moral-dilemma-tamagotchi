import { BaseStatsType, BaseStatKeys } from "@/constants/base";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";

const WIDTH = 40;
const HEIGHT = 40;

export default function Actions({
  rip,
  setHoverText,
  incrementStat,
}: {
  rip: boolean;
  setHoverText: (text: string | null) => void;
  incrementStat: (stat: keyof BaseStatsType) => void;
}) {
  const ActionButton = useMemo(
    () =>
      function ActionButton({
        src,
        alt,
        stat,
        disabled,
      }: {
        src: string;
        alt: string;
        stat: BaseStatKeys;
        disabled: boolean;
      }) {
        return (
          <div
            className={`flex-1 flex items-center justify-center p-2 transition-all bg-zinc-100 duration-300 mt-[-2px] ml-[-2px] border-2 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:bg-zinc-200 cursor-pointer"}`}
            onMouseEnter={() => !disabled && setHoverText(alt)}
            onMouseLeave={() => !disabled && setHoverText(null)}
            onClick={() => !disabled && incrementStat(stat)}
          >
            <Image src={src} alt={alt} width={WIDTH} height={HEIGHT} />
          </div>
        );
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="md:absolute md:left-0 md:ml-8 flex flex-col w-full md:w-auto">
      <motion.div
        key="actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex md:flex-col w-auto"
      >
        <ActionButton
          src="/actions/heal.png"
          alt="heal"
          disabled={rip}
          stat={BaseStatKeys.health}
        />
        <ActionButton
          src="/actions/feed.png"
          alt="feed"
          disabled={rip}
          stat={BaseStatKeys.hunger}
        />
        <ActionButton
          src="/actions/play.png"
          alt="play"
          disabled={rip}
          stat={BaseStatKeys.happiness}
        />
      </motion.div>
    </div>
  );
}
