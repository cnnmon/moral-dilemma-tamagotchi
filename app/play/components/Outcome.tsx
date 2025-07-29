"use client";

import { useOutcome } from "@/app/providers/PetProvider";
import { twMerge } from "tailwind-merge";

export default function Outcome() {
  const { outcome, hideOutcome } = useOutcome();
  if (!outcome) return null;

  const animationClasses = outcome.visible
    ? "opacity-100 scale-100"
    : "opacity-0 scale-90";

  return (
    <div
      className={twMerge(
        "fixed top-0 left-0 w-full border-2 border-black p-4 inset-x-0 max-w-2xl mx-auto mt-10 z-[20] bg-zinc-100 transform text-lg",
        animationClasses
      )}
    >
      <button
        onClick={hideOutcome}
        className="absolute top-1 right-1 hover:opacity-70"
      >
        ✕
      </button>
      <p className="font-pixel pr-6">{outcome.message}</p>
    </div>
  );
}
