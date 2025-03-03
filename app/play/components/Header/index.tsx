import { Doc } from "@/convex/_generated/dataModel";
import { BaseStats } from "./BaseStats";
import { BaseStatsType } from "@/constants/base";
import { Evolution } from "@/constants/evolutions";

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

      <div className="flex flex-col items-end">
        <p className="flex items-center text-zinc-500">
          <b>level {pet.age}</b>—{evolution.id}
        </p>
        <p>
          {pet.age < 2
            ? `${seenDilemmasCount} / ${timeFrame} dilemmas til next evolution`
            : `${seenDilemmasCount} / ${timeFrame} dilemmas til graduation`}
        </p>
      </div>
    </div>
  );
}
