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
      <div className="flex-1 flex">
        <div className="flex-1 md:absolute md:bottom-0 md:left-0 md:p-4">
          <p>
            level {pet.age}: {evolution.id}{" "}
          </p>
          <p>
            {pet.age < 2
              ? `${timeFrame - seenDilemmasCount} dilemma${seenDilemmasCount === 1 ? "" : "s"} until next evolution`
              : "maturity reached (graduate?)"}
          </p>
          <MoralStats moralStats={pet.moralStats} />
        </div>
        <div className="flex-1 md:absolute md:top-0 md:right-0 md:p-4">
          <div className="border-2 border-black p-2 bg-zinc-100 max-w-3xs mb-2">
            {pet.name} is {evolution.description}. {pet.personality}{" "}
          </div>
          <BaseStats pet={pet} />
        </div>
      </div>
    </div>
  );
}
