import {
  useBaseStats,
  usePet,
  useHoverText,
} from "@/app/providers/PetProvider";
import { EvolutionId, getEvolutionTimeFrame } from "@/constants/evolutions";
import { BaseStatKeys } from "@/constants/base";
import { MoralStats } from "../MoralStats";
import { DilemmaTracker } from "./DilemmaTracker";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

export default function Header() {
  const { pet, evolution } = usePet();
  const { setHoverText } = useHoverText();
  const { baseStats } = useBaseStats();
  const [showDilemmaTracker, setShowDilemmaTracker] = useState(false);

  if (!pet || !evolution) {
    return null;
  }

  const timeFrame = getEvolutionTimeFrame(pet.age);
  const hasGraduated = pet.age >= 2;
  const hasRip = pet.evolutionIds.includes(EvolutionId.RIP);
  const remaining = Math.max(0, timeFrame - pet.dilemmas.length);
  const progress = Math.min(pet.dilemmas.length / timeFrame, 1);

  const ageLabel = hasGraduated
    ? `${pet.dilemmas.length} dilemmas completed`
    : hasRip
      ? `died as a ${evolution.id}`
      : `${remaining} more dilemmas to next ${pet.age === 1 ? "graduation" : "evolution"} (${pet.age + 1}/3)`;

  return (
    <div className="text-lg leading-tight">
      <div className="flex flex-col gap-4">
        <h1>{pet.name}</h1>

        {/* pet evolution */}
        <div className="flex flex-col gap-1">
          <div>
            <p>{ageLabel}:</p>
            {/* dilemma progress bar */}
            <div className="w-full border-2 border-black h-5">
              <div
                className="bg-zinc-800 h-full"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          <a
            className="text-zinc-500 hover:text-zinc-700 underline cursor-pointer pointer-events-auto"
            onClick={() => setShowDilemmaTracker(true)}
          >
            view history
          </a>
        </div>

        {/* pet name + age */}
        <div className="border-2 p-2 bg-zinc-100">
          <p>
            {pet.name}
            <span className="opacity-50"> is a </span>
            {evolution.id}, a {evolution.description}. <i>{pet.personality}</i>
          </p>
        </div>

        {/* base stats */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p>stats</p>
            <div className="flex-1 border-t-2 border-black" />
          </div>
          {Object.values(BaseStatKeys).map((stat) => (
            <div key={stat} className="flex items-center gap-2 h-4">
              <span className="w-18 shrink-0">{stat}</span>
              <div className="flex-1 border-2 border-black h-full">
                <div
                  className={twMerge(
                    "h-full",
                    baseStats[stat] < 2 ? "bg-red-500" : "bg-zinc-800",
                  )}
                  style={{ width: `${baseStats[stat] * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* morality */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p>morality</p>
            <div className="flex-1 border-t-2 border-black" />
          </div>
          <MoralStats moralStats={pet.moralStats} />
        </div>
      </div>

      <DilemmaTracker
        isOpen={showDilemmaTracker}
        setIsOpen={setShowDilemmaTracker}
      />
    </div>
  );
}
