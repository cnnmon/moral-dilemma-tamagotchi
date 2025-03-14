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
  hasGraduated,
  hasRip,
}: {
  pet: Doc<"pets">;
  baseStats: BaseStatsType;
  recentDecrements?: Partial<Record<keyof BaseStatsType, number>>;
  recentIncrements?: Partial<Record<keyof BaseStatsType, number>>;
  evolution: Evolution;
  seenDilemmasCount: number;
  timeFrame: number;
  hasGraduated: boolean;
  hasRip: boolean;
}) {
  return (
    <div className="flex flex-col bg-white border-2">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 w-full justify-between p-4">
        <BaseStats
          baseStats={baseStats}
          recentDecrements={recentDecrements}
          recentIncrements={recentIncrements}
          hasGraduated={hasGraduated}
        />

        <div className="flex flex-col sm:items-end text-right">
          <p className="flex items-center text-zinc-500">
            <b>level {pet.age}</b>—{evolution.id}
          </p>
          <p className="text-sm max-w-48">{evolution.description}</p>
        </div>
      </div>

      <hr className="border-1" />

      <div className="p-4">
        {hasGraduated ? (
          <p className="text-zinc-500">{pet.name} has graduated.</p>
        ) : hasRip ? (
          <p className="text-zinc-500">{pet.name} has died.</p>
        ) : (
          <Stat
            label={pet.age < 2 ? "until evolution" : "until graduation"}
            value={(seenDilemmasCount / timeFrame) * 100}
            displayValue={`${seenDilemmasCount}/${timeFrame} dilemmas`}
            dangerous={false}
            hideSkull={true}
            useLerpColors={true}
          />
        )}
      </div>
    </div>
  );
}
