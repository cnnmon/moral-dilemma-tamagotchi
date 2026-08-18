"use client";

import Window from "@/components/Window";
import WindowTextarea from "@/components/WindowTextarea";
import { useDilemma, usePet } from "@/app/providers/PetProvider";
import { dilemmas } from "@/constants/dilemmas";
import { useDilemmaSubmit } from "./useDilemmaSubmit";

export default function Dialog({ onClose }: { onClose: () => void }) {
  const { pet } = usePet();
  const { dilemma } = useDilemma();
  const { handleSubmit, isSubmitting } = useDilemmaSubmit();

  if (!pet || !dilemma) return null;

  const displayText = dilemmas[dilemma.id]?.text.replaceAll("{pet}", pet.name);
  const placeholder = `give ${pet.name} advice — or ask "what do you think?" to push back...`;
  const hasGraduated = pet.age >= 3;

  if (hasGraduated) {
    return (
      <div className="flex w-full text-lg">
        <Window title={`let ${pet.name} answer ! ! !`} setIsOpen={onClose}>
          <div className="flex flex-col gap-2 p-3">
            <p>{displayText}</p>
            <button
              className="border-2 border-black bg-zinc-200 p-2 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
              onClick={() => handleSubmit(`let ${pet.name} answer`)}
            >
              {isSubmitting ? "thinking..." : `Let ${pet.name} answer`}
            </button>
          </div>
        </Window>
      </div>
    );
  }

  return (
    <div className="flex w-full text-lg">
      <WindowTextarea
        key={dilemma.id}
        title={`help ${pet.name} ! ! ! (；￣Д￣)`}
        placeholder={isSubmitting ? "thinking..." : placeholder}
        handleSubmit={isSubmitting ? () => {} : handleSubmit}
        disabled={isSubmitting}
        setIsOpen={onClose}
      >
        <p>{displayText}</p>
      </WindowTextarea>
    </div>
  );
}
