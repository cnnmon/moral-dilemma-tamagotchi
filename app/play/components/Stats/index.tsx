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
    <div className="md:absolute w-full h-full flex flex-col md:items-end md:p-4 pointer-events-none">
      <>
        <div className="border-2 border-black p-2 bg-zinc-100 md:max-w-3xs mb-2 w-full">
          {pet.name} is {evolution.description}. {pet.personality}{" "}
        </div>

        <div className="flex w-full h-full">
          <div className="flex-1 md:absolute md:bottom-0 md:left-0 md:p-4">
            <p>
              level {pet.age}: {evolution.id}{" "}
            </p>
            <p>
              {pet.age < 2
                ? `${timeFrame - seenDilemmasCount} dilemma${seenDilemmasCount === 1 ? "" : "s"} until next evolution`
                : "maturity reached (graduate?)"}
            </p>
          </div>

          <div className="flex-1">
            <BaseStats pet={pet} />
          </div>
        </div>

        <div className="md:absolute md:bottom-0 md:right-0 md:p-4">
          <MoralStats moralStats={pet.moralStats} />
        </div>
      </>
    </div>
  );
}
