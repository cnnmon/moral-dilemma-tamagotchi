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

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div
      className="flex justify-center items-center p-4 w-full sm:w-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <Window
        title={`${pet.name}'s graduation certificate`}
        isOpen={graduationOpen}
        setIsOpen={() => setGraduationOpen(false)}
      >
        <div className="w-full h-full flex flex-col h-[50vh] overflow-y-auto">
          {/* certificate border */}
          <div className="relative border-2 border-zinc-800 p-4 md:p-6 flex-1 overflow-y-auto">
            {/* corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-r-2 border-b-2 border-zinc-800 -translate-x-1 -translate-y-1"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-l-2 border-b-2 border-zinc-800 translate-x-1 -translate-y-1"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-r-2 border-t-2 border-zinc-800 -translate-x-1 translate-y-1"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-l-2 border-t-2 border-zinc-800 translate-x-1 translate-y-1"></div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* left column: pet info */}
              <div className="md:w-1/2 space-y-6">
                {/* pet image and basic info */}
                <div className="flex flex-col items-center">
                  <div className="border border-zinc-800 p-2 bg-white mb-3">
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
                  <h2 className="text-xl font-bold mb-1">{pet.name}</h2>
                  <p className="text-sm text-zinc-600 mb-2">
                    graduated after {seenDilemmas.length} moral dilemmas
                  </p>
                  <p className="text-sm italic text-zinc-500 border-t border-b border-zinc-200 py-1 px-3">
                    {pet.personality}
                  </p>
                </div>

                {/* official seal */}
                <div className="flex justify-center">
                  <div className="border border-zinc-800 rounded-full p-1">
                    <div className="w-12 h-12 flex items-center justify-center border border-zinc-400 rounded-full">
                      <span className="text-[10px] font-bold tracking-widest uppercase rotate-45">
                        official
                      </span>
                    </div>
                  </div>
                </div>

                {/* memories section */}
                <div>
                  <h3 className="text-sm font-medium border-b border-zinc-200 pb-1 mb-3">
                    memories
                  </h3>
                  <div className="min-h-[120px]">
                    {seenDilemmas.length > 0 && dilemma ? (
                      <div className="space-y-2">
                        <div className="bg-white p-3 border border-zinc-800 text-sm">
                          <p className="text-xs italic text-zinc-500 mb-2">
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
                          <hr className="my-2 border-zinc-200" />
                          <p className="mb-1">
                            you said: &quot;{dilemma.responseText}&quot;
                          </p>
                          <p>{dilemma.outcome || "no history"}</p>
                        </div>
                        <div className="flex justify-between items-center text-xs text-zinc-500">
                          <span>
                            day {currentPage} of {totalPages || 1}
                          </span>
                          <div className="space-x-3">
                            <button
                              onClick={goToPreviousPage}
                              className={`underline ${
                                currentPage === 1
                                  ? "text-zinc-300 pointer-events-none"
                                  : "text-zinc-700 hover:bg-zinc-100"
                              }`}
                            >
                              ← prev
                            </button>
                            <button
                              onClick={goToNextPage}
                              className={`underline ${
                                currentPage === totalPages || totalPages === 0
                                  ? "text-zinc-300 pointer-events-none"
                                  : "text-zinc-700 hover:bg-zinc-100"
                              }`}
                            >
                              next →
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-zinc-400 italic text-sm text-center py-8">
                        no memories available
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* right column: evolution and morals */}
              <div className="md:w-1/2 space-y-6">
                {/* evolution journey */}
                <div>
                  <h3 className="text-sm font-medium border-b border-zinc-200 pb-1 mb-3">
                    evolution journey
                  </h3>
                  <div className="space-y-3">
                    {pastEvolutions.map((evolution, index) => (
                      <div
                        key={`${evolution.id}-${index}`}
                        className="group cursor-pointer"
                        onMouseEnter={() => {
                          setHoveredEvolution({
                            age: 3 - index - 1,
                            evolution: evolution.id,
                          });
                        }}
                        onMouseLeave={() => setHoveredEvolution(null)}
                      >
                        <div className="text-sm">
                          <span className="font-medium">
                            level {3 - index}:
                          </span>{" "}
                          <span className="font-bold">{evolution.id}</span>
                          {index < pastEvolutions.length - 1 && (
                            <span className="text-zinc-500 ml-1">
                              — because you made choices that were very{" "}
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

                {/* moral attributes */}
                <div>
                  <h3 className="text-sm font-medium border-b border-zinc-200 pb-1 mb-3">
                    moral attributes
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(pet.moralStats).map(([key, value]) => {
                      const normalizedValue = Math.min(Math.max(value, 0), 10);
                      const position = (normalizedValue / 10) * 100;
                      const attrLabels = attributes[key as MoralDimensions];
                      return (
                        <div
                          key={key}
                          className="border-x border-zinc-800 px-3 py-1"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">
                              {key}{" "}
                              {moralAttributeEmojis[key as MoralDimensions]}
                            </span>
                            <span className="text-zinc-500 text-sm">
                              {value.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span className="w-1/4 truncate">
                              {attrLabels.low}
                            </span>
                            <div className="flex-1 h-1.5 bg-zinc-200 relative">
                              <div
                                className="absolute top-0 h-3 w-0.5 bg-zinc-800 -mt-0.75"
                                style={{ left: `${position}%` }}
                              />
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
