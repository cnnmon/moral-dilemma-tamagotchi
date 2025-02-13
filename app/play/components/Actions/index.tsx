import { BaseStatsType, BaseStatKeys } from "@/constants/base";
import Image from "next/image";
import { useMemo } from "react";

const WIDTH = 40;
const HEIGHT = 40;

export default function Actions({
  setHoverText,
  incrementStat,
}: {
  setHoverText: (text: string | null) => void;
  incrementStat: (stat: keyof BaseStatsType) => void;
}) {
  const ActionButton = useMemo(
    () =>
      function ActionButton({
        src,
        alt,
        stat,
      }: {
        src: string;
        alt: string;
        stat: BaseStatKeys;
      }) {
        return (
          <div
            className={`flex-1 flex items-center justify-center p-2 cursor-pointer transition-all bg-zinc-100 duration-300 hover:scale-105 hover:bg-zinc-200 border-2 mt-[-2px] ml-[-2px]`}
            onMouseEnter={() => setHoverText(alt)}
            onMouseLeave={() => setHoverText(null)}
            onClick={() => incrementStat(stat)}
          >
            <Image src={src} alt={alt} width={WIDTH} height={HEIGHT} />
          </div>
        );
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="sm:absolute sm:left-0 sm:ml-8 flex flex-col w-full sm:w-auto bg-red-500">
      <div className="flex sm:flex-col w-auto">
        <ActionButton
          src="/actions/play.png"
          alt="play"
          stat={BaseStatKeys.happiness}
        />
        <ActionButton
          src="/actions/heal.png"
          alt="heal"
          stat={BaseStatKeys.health}
        />
        <ActionButton
          src="/actions/feed.png"
          alt="feed"
          stat={BaseStatKeys.hunger}
        />
        <ActionButton
          src="/actions/clean.png"
          alt="heal"
          stat={BaseStatKeys.sanity}
        />
      </div>
    </div>
  );
}
