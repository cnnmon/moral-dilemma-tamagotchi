import { Doc } from "@/convex/_generated/dataModel";
import { BaseStats } from "./BaseStats";
import { BaseStatsType } from "@/constants/base";
import { Evolution } from "@/constants/evolutions";
import Stat from "./Stat";

export default function Header({
  pet,
  baseStats,
  recentDecrements,
  recentIncrements,
  evolution,
  seenDilemmasCount,
  timeFrame,
}: {
  pet: Doc<"pets">;
  baseStats: BaseStatsType;
  recentDecrements?: Partial<Record<keyof BaseStatsType, number>>;
  recentIncrements?: Partial<Record<keyof BaseStatsType, number>>;
  evolution: Evolution;
  seenDilemmasCount: number;
  timeFrame: number;
}) {
  return (
    <div className="flex gap-4 w-full bg-white border-2 p-3 justify-between">
      <BaseStats
        baseStats={baseStats}
        recentDecrements={recentDecrements}
        recentIncrements={recentIncrements}
      />

      <div className="flex flex-col items-end text-right">
        <p className="flex items-center text-zinc-500">
          <b>level {pet.age}</b>—{evolution.id}
        </p>
        <p className="text-sm max-w-48 ">{evolution.description}</p>
        <div className="mt-2 w-fit">
          <p className="text-xs text-zinc-500">
            {pet.age < 2
              ? "dilemmas until evolution"
              : "dilemmas until graduation"}{" "}
            ({seenDilemmasCount}/{timeFrame})
          </p>
          <Stat
            value={(seenDilemmasCount / timeFrame) * 100}
            barStyle={{ width: "120px" }}
            containerStyle={{ justifyContent: "end" }}
            dangerous={false}
            hideSkull={true}
            useLerpColors={true}
          />
        </div>
      </div>
    </div>
  );
}
