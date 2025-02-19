import { Doc } from "@/convex/_generated/dataModel";
import { BaseStats } from "./BaseStats";
import { EvolutionId, getEvolution } from "@/constants/evolutions";
import { MoralStats } from "./MoralStats";
import { BaseStatsType } from "@/constants/base";

export default function Stats({
  pet,
  baseStats,
}: {
  pet: Doc<"pets">;
  baseStats: BaseStatsType;
}) {
  const evolution = getEvolution(pet.evolutionId as EvolutionId);

  return (
    <>
      <div className="pointer-events-auto">
        <div className="border-2 border-black p-2 bg-zinc-100 sm:max-w-3xs mb-2 w-full">
          {pet.name} is {evolution.description}. {pet.personality}{" "}
        </div>
      </div>

      <div className="sm:absolute sm:left-0 sm:top-10 sm:px-4 pointer-events-auto flex gap-4 justify-between">
        <BaseStats baseStats={baseStats} />
      </div>

      <div className="sm:absolute sm:bottom-0 sm:right-0 pointer-events-auto sm:p-4 mt-4 sm:mt-0 pb-2">
        <MoralStats moralStats={pet.moralStats} />
      </div>
    </>
  );
}
