import { Doc } from "@/convex/_generated/dataModel";
import Window from "@/components/Window";
import {
  EvolutionId,
  getEvolutions,
  Stage2EvolutionId,
} from "@/constants/evolutions";
import { MoralDimensions } from "@/constants/morals";
import { attributes } from "@/constants/morals";
import { getSprite, Animation } from "@/constants/sprites";
import Image from "next/image";
import { useState } from "react";
import { dilemmaTemplates } from "@/constants/dilemmas";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const moralAttributeEmojis = {
  [MoralDimensions.dominance]: "👑",
  [MoralDimensions.compassion]: "💕",
  [MoralDimensions.devotion]: "👬",
  [MoralDimensions.ego]: "💪",
  [MoralDimensions.purity]: "😇",
  [MoralDimensions.retribution]: "💀",
};

export default function Graduation({
  pet,
  graduationOpen,
  setGraduationOpen,
}: {
  pet: Doc<"pets">;
  graduationOpen: boolean;
  setGraduationOpen: (open: boolean) => void;
}) {
  const maybeSeenDilemmas = useQuery(api.dilemmas.getSeenDilemmas, {
    petId: pet._id,
  });
  const seenDilemmas = maybeSeenDilemmas || [];
  const [hoveredEvolution, setHoveredEvolution] = useState<{
    age: number;
    evolution: string;
  } | null>(null);
  const pastEvolutions = getEvolutions(pet.evolutionId as Stage2EvolutionId);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((seenDilemmas?.length || 0) / 1);
  const dilemma = seenDilemmas?.[currentPage - 1];

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
    <div
      className="p-1 outline-white flex justify-center items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <Window
        title={`${pet.name}'s graduation certificate`}
        isOpen={graduationOpen}
        setIsOpen={() => setGraduationOpen(false)}
      >
        <div className="md:w-6xl overflow-y-auto gap-2">
          {/* corner designs */}
          <div className="absolute top-0 left-0 w-5 h-5 border-r-2 border-b-2 border-zinc-800 -translate-x-2 -translate-y-2"></div>
          <div className="absolute top-0 right-0 w-5 h-5 border-l-2 border-b-2 border-zinc-800 translate-x-2 -translate-y-2"></div>
          <div className="absolute bottom-0 left-0 w-5 h-5 border-r-2 border-t-2 border-zinc-800 -translate-x-2 translate-y-2"></div>
          <div className="absolute bottom-0 right-0 w-5 h-5 border-l-2 border-t-2 border-zinc-800 translate-x-2 translate-y-2"></div>

          <div className="border-2 border-zinc-800 p-3 relative h-145 overflow-y-auto ">
            {/* layout with 2 columns */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* left column: pet image and info */}
              <div className="md:w-2/5">
                {/* pet info section */}
                <div className="flex flex-col items-center mb-3">
                  <div className="border-2 border-zinc-800 p-2 mb-1 bg-white">
                    <Image
                      src={
                        hoveredEvolution
                          ? getSprite(
                              hoveredEvolution.age,
                              Animation.HAPPY,
                              hoveredEvolution.evolution as EvolutionId
                            )
                          : getSprite(
                              pet.age,
                              Animation.HAPPY,
                              pet.evolutionId as Stage2EvolutionId
                            )
                      }
                      alt={pet.name}
                      width={120}
                      height={120}
                      className="mx-auto"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{pet.name}</p>
                    <p className="text-sm mb-1">
                      graduated after {seenDilemmas.length} difficult moral
                      dilemmas
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

                {/* history section */}
                <div className="mt-2">
                  <p className="font-medium border-b border-zinc-200 pb-1 mb-1 text-sm">
                    memories:
                  </p>

                  <div className="min-h-[80px] p-1">
                    {seenDilemmas.length > 0 && dilemma ? (
                      <div className="flex flex-col items-center">
                        <div className="w-full bg-white p-2 border-2 border-zinc-800 text-sm relative h-30 overflow-y-scroll">
                          <p className="text-xs italic text-zinc-500">
                            {dilemma.title && (
                              <span>
                                {dilemma.title in dilemmaTemplates
                                  ? dilemmaTemplates[
                                      dilemma.title
                                    ].text.replace(/{pet}/g, pet.name)
                                  : "dilemma not found"}
                              </span>
                            )}
                          </p>
                          <hr className="my-1 border-zinc-200" />
                          <p>you said: &quot;{dilemma.responseText}&quot;.</p>
                          <p>{dilemma.outcome || "no history"}</p>
                        </div>

                        <div className="text-center mt-1 text-[10px] text-zinc-500">
                          day {currentPage} of {totalPages || 1}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-zinc-400 italic text-sm">
                          no memories available
                        </p>
                      </div>
                    )}

                    {/* navigation controls */}
                    <div className="flex justify-between items-center mt-1 text-sm">
                      <a
                        onClick={goToPreviousPage}
                        className={`underline ${currentPage === 1 ? "text-zinc-300 pointer-events-none" : "text-zinc-700 hover:bg-zinc-100"}`}
                      >
                        ← prev
                      </a>

                      <a
                        onClick={goToNextPage}
                        className={`underline ${currentPage === totalPages || totalPages === 0 ? "text-zinc-300 pointer-events-none" : "text-zinc-700 hover:bg-zinc-100"}`}
                      >
                        next →
                      </a>
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
                  <p className="pl-1 flex flex-col gap-1">
                    {pastEvolutions.map((evolution, index) => (
                      <span
                        key={`${evolution.id}-${index}`}
                        className="leading-none hover:bg-black hover:text-white"
                        onMouseEnter={() => {
                          setHoveredEvolution({
                            age: 3 - index - 1,
                            evolution: evolution.id,
                          });
                        }}
                        onMouseLeave={() => {
                          setHoveredEvolution(null);
                        }}
                      >
                        <span className="flex items-start text-sm last:mb-0">
                          <span className="mr-1">level {3 - index}:</span>
                          <span className="font-bold">{evolution.id}</span>
                          {index < pastEvolutions.length - 1 && (
                            <span className="ml-1 opacity-50">
                              — because you made choices that were very{" "}
                              {evolution.statUsed?.name}
                            </span>
                          )}
                          <br />
                        </span>
                        <span className="italic text-sm opacity-50">
                          {evolution.description}
                        </span>
                      </span>
                    ))}
                  </p>
                </div>

                {/* moral attributes */}
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
                          className="relative border-l-2 border-r-2 border-zinc-800 px-4 py-0.5 leading-none"
                        >
                          <div className="flex justify-between">
                            <span className="italic font-medium">
                              {key}{" "}
                              {moralAttributeEmojis[key as MoralDimensions]}
                            </span>
                            <span className="text-zinc-500">
                              {value.toFixed(1)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm text-zinc-500 mt-0.5 italic">
                            <span className="w-1/3 text-left truncate">
                              {attrLabels.low}
                            </span>

                            {/* position indicator */}
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
          </div>
        </div>
      </Window>
    </div>
  );
}
