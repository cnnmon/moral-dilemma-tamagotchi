import { Doc } from "@/convex/_generated/dataModel";
import Window from "@/components/Window";
import { getEvolutions, Stage2EvolutionId } from "@/constants/evolutions";
import Stat from "../Header/Stat";
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
    <div className="bg-white p-1 w-6xl" onClick={(e) => e.stopPropagation()}>
      <Window
        title={`${pet.name}'s graduation certificate`}
        isOpen={graduationOpen}
        setIsOpen={() => setGraduationOpen(false)}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="border-2 border-zinc-800 p-5 relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-r-2 border-b-2 border-zinc-800 -translate-x-2 -translate-y-2"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-l-2 border-b-2 border-zinc-800 translate-x-2 -translate-y-2"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-r-2 border-t-2 border-zinc-800 -translate-x-2 translate-y-2"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-l-2 border-t-2 border-zinc-800 translate-x-2 translate-y-2"></div>

            {/* certificate header */}
            <div className="text-center mb-2">
              <h1 className="text-md font-bold  border-b-2 border-zinc-800 pb-2 mb-2">
                certificate of graduation
              </h1>
              <p className="text-sm text-zinc-600">this certifies that</p>
            </div>

            {/* pet info section */}
            <div className="flex flex-col items-center mb-6">
              <div className="border-2 border-zinc-800 p-3 mb-2 bg-white">
                <Image
                  src={sprite}
                  alt={pet.name}
                  width={150}
                  height={150}
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="font-bold text-xl">{pet.name}</p>
                <p className="text-sm mb-1">
                  survived for {seenDilemmas.length} days
                </p>
                <p className="italic text-zinc-600 border-t border-b border-zinc-200 py-1 px-4 inline-block">
                  {pet.personality}
                </p>
              </div>
            </div>

            {/* evolutions section */}
            <div className="mb-4">
              <p className="font-medium border-b border-zinc-200 pb-1 mb-2">
                evolution journey:
              </p>
              <div className="pl-2">
                {pastEvolutions.map((evolution, index) => (
                  <div
                    key={evolution.id}
                    className="flex items-center mb-1 last:mb-0"
                  >
                    <span className="text-sm font-mono mr-2">{3 - index}.</span>
                    <span className="font-bold">{evolution.id}</span>
                    {index < pastEvolutions.length - 1 && (
                      <span className="text-xs ml-1 text-zinc-600">
                        — because you made choices that were highly{" "}
                        {evolution.statUsed?.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* moral stats section */}
            <div className="mb-6">
              <p className="font-medium border-b border-zinc-200 pb-1 mb-2">
                moral attributes:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(pet.moralStats).map(([key, value]) => {
                  const normalizedValue = Math.min(Math.max(value, 0), 10);
                  const percentage = (normalizedValue / 10) * 100;
                  const isHighValue = normalizedValue > 5;
                  const attrLabels = attributes[key as MoralDimensions];
                  return (
                    <div key={key}>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{key}</span>
                        <span className="ml-auto text-sm py-0.5 text-zinc-800">
                          {value.toFixed(1)}
                        </span>
                      </div>
                      <Stat
                        value={percentage}
                        barStyle={{
                          width: "100%",
                          height: "12px",
                        }}
                        customBarColor={
                          isHighValue
                            ? "bg-gradient-to-r from-zinc-300 to-red-300"
                            : "bg-gradient-to-r from-blue-300 to-zinc-300"
                        }
                        dangerous={normalizedValue > 7}
                        useLerpColors={true}
                        hideSkull={true}
                      />
                      <div className="flex justify-between text-xs mt-1 text-zinc-500">
                        <span className="italic">{attrLabels.low}</span>
                        <span className="italic">{attrLabels.high}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* history section - keeping this mostly as is since the user likes it */}
            <div className="mt-4">
              <p className="mb-2 font-medium border-b border-zinc-200 pb-1">
                memories:
              </p>

              <div className="min-h-[120px] border-2 border-zinc-800 px-4 py-3 relative">
                {seenDilemmas.length > 0 && dilemma ? (
                  <div className="flex flex-col items-center">
                    <div className="text-center mb-2 text-xs text-zinc-500">
                      day {currentPage} of {totalPages || 1}
                    </div>

                    <div className="w-full bg-white p-4 border-2 border-zinc-800 text-sm relative">
                      {dilemma.outcome || "no history"}
                    </div>

                    {dilemma.title && (
                      <div className="text-center mt-2 text-xs font-medium">
                        {dilemmaTemplates[dilemma.title].text.replace(
                          /{pet}/g,
                          pet.name
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-zinc-400 italic">
                      no memories available
                    </p>
                  </div>
                )}
              </div>

              {/* navigation controls */}
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`p-1 border-2 border-zinc-800 ${currentPage === 1 ? "text-zinc-300 border-zinc-300" : "text-zinc-700 hover:bg-zinc-100"}`}
                >
                  ← prev
                </button>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-1 border-2 border-zinc-800 ${currentPage === totalPages || totalPages === 0 ? "text-zinc-300 border-zinc-300" : "text-zinc-700 hover:bg-zinc-100"}`}
                >
                  next →
                </button>
              </div>
            </div>

            {/* official seal */}
            <div className="text-center mb-4">
              <div className="inline-block border-2 border-zinc-800 rounded-full p-2 mb-1">
                <div className="w-20 h-20 flex items-center justify-center border-2 border-zinc-400 rounded-full">
                  <span className="text-xs font-bold tracking-widest uppercase rotate-45">
                    official
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Window>
    </div>
  );
}
