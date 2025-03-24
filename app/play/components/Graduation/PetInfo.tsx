import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { useState } from "react";
import { getSprite, Animation } from "@/constants/sprites";
import { EvolutionId, Stage2EvolutionId } from "@/constants/evolutions";
import { dilemmaTemplates } from "@/constants/dilemmas";

interface Dilemma {
  title: string;
  responseText: string;
  outcome?: string;
}

// pet image and basic info component
function PetImageSection({
  pet,
  dilemmaCount,
  hoveredEvolutionId,
}: {
  pet: Doc<"pets">;
  dilemmaCount: number;
  hoveredEvolutionId?: EvolutionId;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="border border-zinc-800 p-2 bg-white mb-3">
        <Image
          src={getSprite(
            Animation.HAPPY,
            hoveredEvolutionId || (pet.evolutionId as Stage2EvolutionId)
          )}
          alt={pet.name}
          width={120}
          height={120}
          className="mx-auto"
        />
      </div>
      <h2 className="text-xl font-bold mb-1">{pet.name}</h2>
      <p className="text-sm text-zinc-600 mb-2">
        graduated after {dilemmaCount} moral dilemmas
      </p>
      <p className="text-sm italic text-zinc-500 border-t border-b border-zinc-200 py-1 px-3">
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
  dilemma: Dilemma;
  petName: string;
}) {
  return (
    <>
      <p className="text-sm italic text-zinc-500 mb-2">
        {dilemma.title && (
          <span>
            {dilemma.title in dilemmaTemplates
              ? dilemmaTemplates[dilemma.title].text.replace(/{pet}/g, petName)
              : "dilemma not found"}
          </span>
        )}
      </p>
      <div className="bg-white p-3 border border-zinc-800 text-sm h-full">
        <p className="mb-1">you said: &quot;{dilemma.responseText}&quot;</p>
        <hr className="my-2 border-zinc-200" />
        <p>{dilemma.outcome || "no history"}</p>
      </div>
    </>
  );
}

// memories section component
function MemoriesSection({
  seenDilemmas,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  petName,
}: {
  seenDilemmas: Dilemma[];
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  petName: string;
}) {
  const dilemma = seenDilemmas?.[currentPage - 1];
  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-4 border-b border-zinc-200 pb-1">
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
        <h3 className="text-sm font-medium">memories</h3>
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
      <p className="text-xs text-zinc-500">
        day {currentPage} of {totalPages || 1}
      </p>
      {seenDilemmas.length > 0 && dilemma ? (
        <MemoryCard dilemma={dilemma} petName={petName} />
      ) : (
        <p className="text-zinc-400 italic text-sm text-center py-8">
          no memories available
        </p>
      )}
    </div>
  );
}

export default function PetInfo({
  pet,
  seenDilemmas,
  hoveredEvolutionId,
}: {
  pet: Doc<"pets">;
  seenDilemmas: Dilemma[];
  hoveredEvolutionId?: EvolutionId;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((seenDilemmas?.length || 0) / 1);

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
        dilemmaCount={seenDilemmas.length}
        hoveredEvolutionId={hoveredEvolutionId}
      />
      <MemoriesSection
        seenDilemmas={seenDilemmas}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        petName={pet.name}
      />
    </div>
  );
}
