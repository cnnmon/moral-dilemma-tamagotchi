import { Doc } from "@/convex/_generated/dataModel";
import { BaseStats } from "./BaseStats";
import { BaseStatsType } from "@/constants/base";
import { Evolution } from "@/constants/evolutions";
import Stat from "./Stat";
import { motion } from "framer-motion";

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
        <div className="flex flex-col sm:items-end sm:text-right">
          <p className="flex items-center text-zinc-500">
            <b>level {pet.age + 1}/3</b>—{evolution.id}
          </p>
          <motion.div
            key={pet.personality}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.2, times: [0, 0.5, 1] }}
              key={`flicker-${pet.personality}`}
            >
              <p className="text-xs text-zinc-500 w-64 italic">
                {evolution.description}.{" "}
                {pet.personality || "no personality yet."}
              </p>
            </motion.div>
          </motion.div>
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
            label={pet.age < 2 ? "until next evolution" : "until graduation"}
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
