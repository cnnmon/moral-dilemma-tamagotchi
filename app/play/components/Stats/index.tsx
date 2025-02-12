import { Doc } from "@/convex/_generated/dataModel";
import { BaseStats } from "./BaseStats";
import {
  EvolutionId,
  getEvolution,
  getEvolutionTimeFrame,
} from "@/constants/evolutions";
import { MoralStats } from "./MoralStats";

export default function Stats({
  pet,
  seenDilemmasCount,
}: {
  pet: Doc<"pets">;
  seenDilemmasCount: number;
}) {
  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  const timeFrame = getEvolutionTimeFrame(pet.age);

  return (
    <div className="gap-2 flex flex-col">
      <div className="flex-1 flex flex-col gap-2 md:absolute md:top-0 md:left-0 md:p-4">
        <div className="border-2 border-black p-2 bg-zinc-100 max-w-xl">
          {pet.name} is {evolution.description}. {pet.personality}{" "}
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 md:absolute md:bottom-0 md:left-0 md:p-4">
          level {pet.age}: {evolution.id} ({timeFrame - seenDilemmasCount}{" "}
          dilemmas until next evolution)
          <MoralStats moralStats={pet.moralStats} />
        </div>
        <div className="flex-1 md:absolute md:top-0 md:right-0 md:p-4">
          <BaseStats pet={pet} />
        </div>
      </div>
    </div>
  );
}
