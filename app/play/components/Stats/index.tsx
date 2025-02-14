import { Doc } from "@/convex/_generated/dataModel";
import { BaseStats } from "./BaseStats";
import {
  EvolutionId,
  getEvolution,
  getEvolutionTimeFrame,
} from "@/constants/evolutions";
import { MoralStats } from "./MoralStats";
import { BaseStatsType } from "@/constants/base";

export default function Stats({
  pet,
  baseStats,
  seenDilemmasCount,
}: {
  pet: Doc<"pets">;
  baseStats: BaseStatsType;
  seenDilemmasCount: number;
}) {
  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  const timeFrame = getEvolutionTimeFrame(pet.age);

  return (
    <>
      <div className="pointer-events-auto">
        <div className="border-2 border-black p-2 bg-zinc-100 sm:max-w-3xs mb-2 w-full">
          {pet.name} is {evolution.description}. {pet.personality}{" "}
        </div>
      </div>

      <div className="pointer-events-auto flex gap-4 justify-between">
        <div className="sm:absolute sm:bottom-0 sm:left-0 sm:p-4">
          <p className="flex items-center">
            [<b>level {pet.age}</b>: {evolution.id}]
          </p>
          <p>
            {pet.age < 2
              ? `${seenDilemmasCount} / ${timeFrame} dilemmas til next evolution . . .`
              : `${seenDilemmasCount} / ${timeFrame} dilemmas til graduation . . .`}
          </p>
        </div>
        <BaseStats baseStats={baseStats} />
      </div>

      <div className="sm:absolute sm:bottom-0 sm:right-0 pointer-events-auto sm:p-4 mt-4 sm:mt-0 pb-2">
        <MoralStats moralStats={pet.moralStats} />
      </div>
    </>
  );
}
