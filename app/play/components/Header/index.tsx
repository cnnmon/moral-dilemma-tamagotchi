import Stat from "./Stat";
import { usePet, useHoverText } from "@/app/providers/PetProvider";
import { EvolutionId, getEvolutionTimeFrame } from "@/constants/evolutions";
import ActionButtons from "./ActionButtons";

export default function Header() {
  const { pet, evolution } = usePet();
  const { setHoverText } = useHoverText();

  if (!pet || !evolution) {
    return null;
  }

  const timeFrame = getEvolutionTimeFrame(pet.age);
  const hasGraduated = pet.age >= timeFrame;
  const hasRip = pet.evolutionIds.includes(EvolutionId.RIP);

  return (
    <div className="flex flex-col bg-white border-2">
      <div className="flex gap-4 w-full">
        <div className="w-1/3">
          <ActionButtons />
        </div>
        <div className="border-l-2 p-4 w-full text-lg flex flex-col gap-2">
          <p className="flex items-center gap-1 pointer-events-auto">
            &quot;{pet.name}&quot; is a
            <span
              className="underline hover:bg-zinc-500 hover:text-white cursor-default"
              onMouseEnter={() => setHoverText(`level ${pet.age + 1} of 3`)}
              onMouseLeave={() => setHoverText(null)}
            >
              level {pet.age + 1}
            </span>
            <span
              className="underline hover:bg-zinc-500 hover:text-white cursor-default"
              onMouseEnter={() => setHoverText(evolution.description)}
              onMouseLeave={() => setHoverText(null)}
            >
              {evolution.id}
            </span>
            .
          </p>
          <p className="italic border-2 p-2">
            {pet.personality || "no personality yet."}
          </p>
        </div>
      </div>

      <hr className="border-1" />

      <div className="p-4 text-lg">
        {hasGraduated ? (
          <p className="text-zinc-500">{pet.name} has graduated.</p>
        ) : hasRip ? (
          <p className="text-zinc-500">{pet.name} has died.</p>
        ) : (
          <Stat
            label={pet.age < 2 ? "until next evolution" : "until graduation"}
            value={(pet.dilemmas.length / timeFrame) * 100}
            displayValue={`${pet.dilemmas.length}/${timeFrame} dilemmas`}
            dangerous={false}
            hideSkull={true}
            useLerpColors={true}
          />
        )}
      </div>
    </div>
  );
}
