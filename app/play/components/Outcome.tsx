"use client";

import { useOutcome, useHoverText } from "@/app/providers/PetProvider";
import { attributes, MoralDimensions } from "@/constants/morals";
import { twMerge } from "tailwind-merge";

// describe a +/- moral dimension change as "more <attribute>"
const describeChange = (change: string): string | null => {
  const sign = change[0];
  const key = change.slice(1) as MoralDimensions;
  const range = attributes[key];
  if (!range) return null;
  return `more ${sign === "+" ? range.high : range.low}`;
};

export default function Outcome() {
  const { outcome, hideOutcome } = useOutcome();
  const { setHoverText } = useHoverText();
  if (!outcome) return null;

  // split "outcome text (+key1, -key2)" into body and changes
  const parenIdx = outcome.message.lastIndexOf(" (");
  const mainText =
    parenIdx > -1 ? outcome.message.slice(0, parenIdx) : outcome.message;
  const changesRaw =
    parenIdx > -1 ? outcome.message.slice(parenIdx + 2, -1) : "";
  const changes = changesRaw ? changesRaw.split(",").map((s) => s.trim()) : [];

  const animationClasses = outcome.visible
    ? "opacity-100 scale-100"
    : "opacity-0 scale-90";

  return (
    <div className="absolute top-0 flex items-center justify-center pt-4 z-30 text-lg">
      <div
        className={twMerge(
          "border-2 border-black px-3 py-2 bg-zinc-100 transform transition-all duration-300 relative mx-4",
          animationClasses,
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
              {" "}
              (
              {changes.map((c, i) => {
                const tooltip = describeChange(c);
                return (
                  <span
                    key={i}
                    onMouseEnter={() => tooltip && setHoverText(tooltip)}
                    onMouseLeave={() => setHoverText(null)}
                    className={
                      c.startsWith("-")
                        ? "text-red-500 hover:opacity-50"
                        : c.startsWith("+")
                          ? "text-[#3493DC] hover:opacity-50"
                          : ""
                    }
                  >
                    {c}
                    {i < changes.length - 1 ? ", " : ""}
                  </span>
                );
              })}
              )
            </>
          )}
        </p>
      </div>
    </div>
  );
}
