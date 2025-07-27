import {
  EvolutionId,
  evolutionToStat,
  getEvolution,
  Stage2EvolutionId,
} from "@/constants/evolutions";
import { Pet } from "@/app/storage/pet";

export default function EvolutionJourney({
  pet,
  hoveredEvolutionId,
  onHover,
}: {
  pet: Pet;
  hoveredEvolutionId: EvolutionId | undefined;
  onHover: (evolutionId: EvolutionId | undefined) => void;
}) {
  return (
    <div>
      <h3 className="font-medium border-b border-zinc-200 pb-1 mb-3">
        evolution journey
      </h3>
      <div className="space-y-3">
        {pet.evolutionIds.map((evolutionId, index) => (
          <div
            key={`${evolutionId}-${index}`}
            className={`group cursor-pointer ${
              evolutionId === hoveredEvolutionId ? "bg-black text-white" : ""
            }`}
            onMouseEnter={() => onHover(evolutionId as EvolutionId)}
            onMouseLeave={() => onHover(undefined)}
          >
            <div>
              <span className="font-medium">level {3 - index}:</span>{" "}
              <span className="font-bold">{evolutionId}</span>
              {index < pet.evolutionIds.length - 1 && (
                <span className="text-zinc-500 ml-1">
                  — because you made choices that were{" "}
                  {evolutionToStat[evolutionId as EvolutionId]}
                </span>
              )}
            </div>
            <p className="text-zinc-500 italic mt-1">
              {getEvolution(evolutionId as Stage2EvolutionId).description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
