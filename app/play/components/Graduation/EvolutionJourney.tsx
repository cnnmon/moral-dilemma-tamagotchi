import { Doc } from "@/convex/_generated/dataModel";
import {
  EvolutionId,
  getEvolutions,
  Stage2EvolutionId,
} from "@/constants/evolutions";

export default function EvolutionJourney({
  pet,
  hoveredEvolutionId,
  onHover,
}: {
  pet: Doc<"pets">;
  hoveredEvolutionId: EvolutionId | undefined;
  onHover: (evolutionId: EvolutionId | undefined) => void;
}) {
  const pastEvolutions = getEvolutions(pet.evolutionId as Stage2EvolutionId);
  return (
    <div>
      <h3 className="text-sm font-medium border-b border-zinc-200 pb-1 mb-3">
        evolution journey
      </h3>
      <div className="space-y-3">
        {pastEvolutions.map((evolution, index) => (
          <div
            key={`${evolution.id}-${index}`}
            className={`group cursor-pointer ${
              evolution.id === hoveredEvolutionId ? "bg-black text-white" : ""
            }`}
            onMouseEnter={() => onHover(evolution.id as EvolutionId)}
            onMouseLeave={() => onHover(undefined)}
          >
            <div className="text-sm">
              <span className="font-medium">level {3 - index}:</span>{" "}
              <span className="font-bold">{evolution.id}</span>
              {index < pastEvolutions.length - 1 && (
                <span className="text-zinc-500 ml-1">
                  — because you made choices that were{" "}
                  {evolution.statUsed?.name}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 italic mt-1">
              {evolution.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
