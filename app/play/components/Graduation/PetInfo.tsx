import Image from "next/image";
import { useState } from "react";
import { getSprite, Animation } from "@/constants/sprites";
import { EvolutionId } from "@/constants/evolutions";
import { dilemmas } from "@/constants/dilemmas";
import { ActiveDilemma, Pet } from "@/app/storage/pet";

// pet image and basic info component
function PetImageSection({
  pet,
  dilemmaCount,
  hoveredEvolutionId,
}: {
  pet: Pet;
  dilemmaCount: number;
  hoveredEvolutionId?: EvolutionId;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="border border-zinc-800 p-2 bg-white mb-3">
        <Image
          src={getSprite(
            Animation.HAPPY,
            hoveredEvolutionId || pet.evolutionIds[0]
          )}
          alt={pet.name}
          width={120}
          height={120}
          className="mx-auto"
        />
      </div>
      <h2 className="text-xl font-bold mb-1">{pet.name}</h2>
      <p className="text-zinc-600 mb-2">
        graduated after {dilemmaCount} moral dilemmas
      </p>
      <p className="italic text-zinc-500 border-t border-b border-zinc-200 py-1 px-3">
        {pet.personality}
      </p>
    </div>
  );
}

// memory card component
function MemoryCard({
  dilemma,
  petName,
}: {
  dilemma: ActiveDilemma;
  petName: string;
}) {
  return (
    <>
      <p className="italic text-zinc-500 mb-2">
        {dilemma.id && (
          <span>
            {dilemma.id in dilemmas
              ? dilemmas[dilemma.id].text.replace(/{pet}/g, petName)
              : "dilemma not found"}
          </span>
        )}
      </p>
      <div className="bg-white p-3 border border-zinc-800 h-full">
        <p className="mb-1">
          you said: &quot;{dilemma.messages[0].content}&quot;
        </p>
        <hr className="my-2 border-zinc-200" />
        <p>{dilemma.messages[1].content || "no history"}</p>
      </div>
    </>
  );
}

// memories section component
function MemoriesSection({
  dilemmas,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  petName,
}: {
  dilemmas: ActiveDilemma[];
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  petName: string;
}) {
  const dilemma = dilemmas?.[currentPage - 1];
  return (
    <div>
      <div className="flex justify-between items-center mb-4 border-b border-zinc-200 pb-1">
        <a
          onClick={onPrevious}
          className={`underline text-zinc-500 no-drag ${
            currentPage === 1
              ? "text-zinc-300 pointer-events-none"
              : "text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          ← prev
        </a>
        <h3 className="font-medium">memories</h3>
        <a
          onClick={onNext}
          className={`underline text-zinc-500 no-drag ${
            currentPage === totalPages || totalPages === 0
              ? "text-zinc-300 pointer-events-none"
              : "text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          next →
        </a>
      </div>
      <p className="text-zinc-500">
        day {currentPage} of {totalPages || 1}
      </p>
      {dilemmas.length > 0 && dilemma ? (
        <MemoryCard dilemma={dilemma} petName={petName} />
      ) : (
        <p className="text-zinc-400 italic text-center py-8">
          no memories available
        </p>
      )}
    </div>
  );
}

export default function PetInfo({
  pet,
  hoveredEvolutionId,
}: {
  pet: Pet;
  hoveredEvolutionId?: EvolutionId;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((pet.dilemmas?.length || 0) / 1);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="md:w-1/2 space-y-6">
      <PetImageSection
        pet={pet}
        dilemmaCount={pet.dilemmas.length}
        hoveredEvolutionId={hoveredEvolutionId}
      />
      <MemoriesSection
        dilemmas={pet.dilemmas}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        petName={pet.name}
      />
    </div>
  );
}
