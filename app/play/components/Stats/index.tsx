import { Doc } from "@/convex/_generated/dataModel";
import { BaseStats } from "./BaseStats";
import {
  EvolutionId,
  getEvolution,
  getEvolutionTimeFrame,
} from "@/constants/evolutions";
import { MoralStats } from "./MoralStats";
import { TransparencyGridIcon } from "@radix-ui/react-icons";

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
    <>
      <div className="pointer-events-auto">
        <div className="border-2 border-black p-2 bg-zinc-100 md:max-w-3xs mb-2 w-full">
          {pet.name} is {evolution.description}. {pet.personality}{" "}
        </div>
      </div>

      <div className="pointer-events-auto flex gap-4 justify-between">
        <div className="md:absolute md:bottom-0 md:left-0 md:p-4">
          <TransparencyGridIcon className="mb-1" />
          <p>
            [<b>level {pet.age}</b>: {evolution.id}]
          </p>
          <p>
            {pet.age < 2
              ? `${timeFrame - seenDilemmasCount} dilemma${seenDilemmasCount === 1 ? "" : "s"} until next evolution . . .`
              : "maturity achieved"}
          </p>
        </div>
        <BaseStats pet={pet} />
      </div>

      <div className="md:absolute md:bottom-0 md:right-0 pointer-events-auto md:p-4 mt-4 md:mt-0">
        <MoralStats moralStats={pet.moralStats} />
      </div>
    </>
  );
}
