import { Doc } from "@/convex/_generated/dataModel";
import Window from "@/components/Window";
import { getEvolutions, Stage2EvolutionId } from "@/constants/evolutions";
import { MoralDimensions } from "@/constants/morals";
import { attributes } from "@/constants/morals";
import { getSprite, Animation } from "@/constants/sprites";
import Image from "next/image";
import { useState } from "react";
import { dilemmaTemplates } from "@/constants/dilemmas";

export default function Graduation({
  pet,
  seenDilemmas,
  graduationOpen,
  setGraduationOpen,
}: {
  pet: Doc<"pets">;
  seenDilemmas: Doc<"dilemmas">[];
  graduationOpen: boolean;
  setGraduationOpen: (open: boolean) => void;
}) {
  // get the past evolutions
  const pastEvolutions = getEvolutions(pet.evolutionId as Stage2EvolutionId);

  // get the pet image
  const sprite = getSprite(
    pet.age,
    Animation.HAPPY,
    pet.evolutionId as Stage2EvolutionId
  );

  // pagination for dilemma history
  const itemsPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(seenDilemmas.length / itemsPerPage);

  // calculate which dilemmas to show based on current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const dilemma = seenDilemmas[startIndex];

  // handle page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-white p-1 w-5xl" onClick={(e) => e.stopPropagation()}>
      <Window
        title={`${pet.name}'s graduation certificate`}
        isOpen={graduationOpen}
        setIsOpen={() => setGraduationOpen(false)}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="border-2 border-zinc-800 p-3 relative">
            {/* corner designs */}
            <div className="absolute top-0 left-0 w-5 h-5 border-r-2 border-b-2 border-zinc-800 -translate-x-2 -translate-y-2"></div>
            <div className="absolute top-0 right-0 w-5 h-5 border-l-2 border-b-2 border-zinc-800 translate-x-2 -translate-y-2"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 border-r-2 border-t-2 border-zinc-800 -translate-x-2 translate-y-2"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-l-2 border-t-2 border-zinc-800 translate-x-2 translate-y-2"></div>

            {/* layout with 2 columns */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* left column: pet image and info */}
              <div className="md:w-2/5">
                {/* certificate header */}
                <div className="text-center mb-2">
                  <h1 className="text-md font-bold border-b-2 border-zinc-800 pb-1 mb-1">
                    certificate of graduation
                  </h1>
                </div>

                {/* pet info section */}
                <div className="flex flex-col items-center mb-3">
                  <div className="border-2 border-zinc-800 p-2 mb-1 bg-white">
                    <Image
                      src={sprite}
                      alt={pet.name}
                      width={120}
                      height={120}
                      className="mx-auto"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{pet.name}</p>
                    <p className="text-sm mb-1">
                      survived for {seenDilemmas.length} days
                    </p>
                    <p className="italic text-zinc-600 border-t border-b border-zinc-200 py-1 px-2 text-sm inline-block">
                      {pet.personality}
                    </p>
                  </div>
                </div>

                {/* official seal */}
                <div className="text-center mb-0">
                  <div className="inline-block border-2 border-zinc-800 rounded-full p-1 mb-1">
                    <div className="w-14 h-14 flex items-center justify-center border-2 border-zinc-400 rounded-full">
                      <span className="text-[10px] font-bold tracking-widest uppercase rotate-45">
                        official
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* right column: moral attributes and evolutions */}
              <div className="md:w-3/5 flex flex-col">
                {/* evolutions section */}
                <div className="mb-3">
                  <p className="font-medium border-b border-zinc-200 pb-1 mb-1 text-sm">
                    evolution journey:
                  </p>
                  <div className="pl-1">
                    {pastEvolutions.map((evolution, index) => (
                      <div
                        key={`${evolution.id}-${index}`}
                        className="flex items-start text-sm mb-1 last:mb-0"
                      >
                        <span className="font-mono mr-1">{3 - index}.</span>
                        <span className="font-bold">{evolution.id}</span>
                        {index < pastEvolutions.length - 1 && (
                          <span className="ml-1 text-zinc-600">
                            — highly {evolution.statUsed?.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* moral attributes - new compact version */}
                <div className="mb-2">
                  <p className="font-medium border-b border-zinc-200 pb-1 mb-1 text-sm">
                    moral attributes:
                  </p>
                  <div className="space-y-1">
                    {Object.entries(pet.moralStats).map(([key, value]) => {
                      const normalizedValue = Math.min(Math.max(value, 0), 10);
                      const position = (normalizedValue / 10) * 100;
                      const attrLabels = attributes[key as MoralDimensions];
                      return (
                        <div
                          key={key}
                          className="relative border-l-2 border-r-2 border-zinc-800 px-4 py-0.5"
                        >
                          <div className="flex justify-between">
                            <span className="italic font-medium">{key}</span>
                            <span className="text-zinc-500">
                              {value.toFixed(1)}
                            </span>
                          </div>

                          {/* Simplified attribute scale */}
                          <div className="flex justify-between items-center text-sm text-zinc-500 mt-0.5 italic">
                            <span className="w-1/3 text-left truncate">
                              {attrLabels.low}
                            </span>

                            {/* Position indicator */}
                            <div className="relative w-[90%] h-2 bg-zinc-200">
                              <div
                                className="absolute top-0 h-4 w-1 bg-zinc-800 -mt-1"
                                style={{ left: `${position}%` }}
                              ></div>
                            </div>

                            <span className="w-1/4 text-right">
                              {attrLabels.high}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* history section */}
            <div className="mt-2">
              <p className="font-medium border-b border-zinc-200 pb-1 mb-1 text-sm">
                memories:
              </p>

              <div className="min-h-[80px] px-4 py-2 relative">
                {seenDilemmas.length > 0 && dilemma ? (
                  <div className="flex flex-col items-center">
                    <div className="text-center mb-1 text-[10px] text-zinc-500">
                      day {currentPage} of {totalPages || 1}
                    </div>

                    <div className="w-full bg-white p-2 border-2 border-zinc-800 text-sm relative">
                      {dilemma.outcome || "no history"}
                    </div>

                    {dilemma.title && (
                      <div className="text-center mt-1 text-sm italic text-zinc-500">
                        {dilemmaTemplates[dilemma.title].text.replace(
                          /{pet}/g,
                          pet.name
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-zinc-400 italic text-sm">
                      no memories available
                    </p>
                  </div>
                )}

                {/* navigation controls */}
                <div className="flex justify-between items-center mt-1">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-1 text-sm border-2 border-zinc-800 ${currentPage === 1 ? "text-zinc-300 border-zinc-300" : "text-zinc-700 hover:bg-zinc-100"}`}
                  >
                    ← prev
                  </button>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`p-1 text-sm border-2 border-zinc-800 ${currentPage === totalPages || totalPages === 0 ? "text-zinc-300 border-zinc-300" : "text-zinc-700 hover:bg-zinc-100"}`}
                  >
                    next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Window>
    </div>
  );
}
