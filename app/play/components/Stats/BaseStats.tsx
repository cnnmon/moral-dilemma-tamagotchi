import Stat from "./Stat";
import { BaseStatKeys, BaseStatsType } from "@/constants/base";

export function BaseStats({
  baseStats,
  recentDecrements = {},
  recentIncrements = {},
}: {
  baseStats: BaseStatsType;
  recentDecrements?: Partial<Record<keyof BaseStatsType, number>>;
  recentIncrements?: Partial<Record<keyof BaseStatsType, number>>;
}) {
  return (
    <div>
      {Object.keys(BaseStatKeys).map((key) => {
        const statKey = key as keyof BaseStatsType;
        const decrement = recentDecrements[statKey] ?? 0;
        const increment = recentIncrements[statKey] ?? 0;

        return (
          <div key={statKey} className="flex items-center">
            <Stat
              label={statKey}
              value={baseStats[statKey] * 10}
              decrement={decrement}
              increment={increment}
            />
          </div>
        );
      })}
    </div>
  );
}
