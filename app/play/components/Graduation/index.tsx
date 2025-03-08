import { Doc } from "@/convex/_generated/dataModel";
import Window from "@/components/Window";
import { getEvolutions, Stage2EvolutionId } from "@/constants/evolutions";

export default function Graduation({
  pet,
  seenDilemmaCount,
  graduationOpen,
  setGraduationOpen,
}: {
  pet: Doc<"pets">;
  seenDilemmaCount: number;
  graduationOpen: boolean;
  setGraduationOpen: (open: boolean) => void;
}) {
  // get the past evolutions
  const pastEvolutions = getEvolutions(pet.evolutionId as Stage2EvolutionId);

  return (
    <div
      className="bg-white p-1 w-full max-w-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <Window
        title={`${pet.name}'s graduation certificate`}
        isOpen={graduationOpen}
        setIsOpen={() => setGraduationOpen(false)}
      >
        <div className="flex flex-col gap-2">
          <p>name: {pet.name}.</p>
          <p>personality: {pet.personality}.</p>
          <div>
            <p>evolutions: </p>
            {pastEvolutions.map((evolution, index) => (
              <p key={evolution.id}>
                {evolution.id}
                {index < pastEvolutions.length - 1 &&
                  `, because you made choices that were highly ${evolution.statUsed?.name}`}
              </p>
            ))}
          </div>
          <p>age: {seenDilemmaCount} days.</p>
        </div>
      </Window>
    </div>
  );
}
