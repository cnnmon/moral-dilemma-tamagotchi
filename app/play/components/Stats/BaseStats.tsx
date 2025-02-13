import Stat from "./Stat";
import { BaseStatsType } from "@/constants/base";

export function BaseStats({ baseStats }: { baseStats: BaseStatsType }) {
  return (
    <div>
      <Stat label="health" value={baseStats.health * 10} />
      <Stat label="hunger" value={baseStats.hunger * 10} />
      <Stat label="happiness" value={baseStats.happiness * 10} />
      <Stat label="sanity" value={baseStats.sanity * 10} />
    </div>
  );
}
