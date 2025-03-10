import Stat from "./Stat";
import { BaseStatKeys, BaseStatsType } from "@/constants/base";

export function BaseStats({
  baseStats,
  recentDecrements = {},
  recentIncrements = {},
  hasGraduated,
}: {
  baseStats: BaseStatsType;
  recentDecrements?: Partial<Record<keyof BaseStatsType, number>>;
  recentIncrements?: Partial<Record<keyof BaseStatsType, number>>;
  hasGraduated: boolean;
}) {
  return (
    <div>
      {Object.keys(BaseStatKeys).map((key) => {
        const statKey = key as keyof BaseStatsType;
        const decrement = recentDecrements[statKey] ?? 0;
        const increment = recentIncrements[statKey] ?? 0;
        const value = baseStats[statKey] * 10;
        return (
          <div key={statKey}>
            <Stat
              label={statKey}
              value={value}
              displayValue={`${Math.round(value)}/100`}
              decrement={decrement}
              increment={increment}
              barStyle={{ width: "100px" }}
              disabled={hasGraduated}
            />
          </div>
        );
      })}
    </div>
  );
}
