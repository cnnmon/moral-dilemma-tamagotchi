"use client";

import { useOutcome } from "@/app/providers/PetProvider";
import { twMerge } from "tailwind-merge";

export default function Outcome() {
  const { outcome, hideOutcome } = useOutcome();
  if (!outcome) return null;

  // split "outcome text (+key1, -key2)" into body and changes
  const parenIdx = outcome.message.lastIndexOf(" (");
  const mainText = parenIdx > -1 ? outcome.message.slice(0, parenIdx) : outcome.message;
  const changesRaw = parenIdx > -1 ? outcome.message.slice(parenIdx + 2, -1) : "";
  const changes = changesRaw ? changesRaw.split(",").map((s) => s.trim()) : [];

  const animationClasses = outcome.visible
    ? "opacity-100 scale-100"
    : "opacity-0 scale-90";

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div
        className={twMerge(
          "border-2 border-black p-4 bg-zinc-100 transform transition-all duration-300 relative mx-4",
          animationClasses
        )}
      >
        <button
          onClick={hideOutcome}
          className="absolute top-1 right-1 hover:opacity-70"
        >
          ✕
        </button>
        <p className="pr-6">
          {mainText}
          {changes.length > 0 && (
            <>
              {" "}(
              {changes.map((c, i) => (
                <span
                  key={i}
                  className={c.startsWith("-") ? "text-red-500" : ""}
                >
                  {c}
                  {i < changes.length - 1 ? ", " : ""}
                </span>
              ))}
              )
            </>
          )}
        </p>
      </div>
    </div>
  );
}
