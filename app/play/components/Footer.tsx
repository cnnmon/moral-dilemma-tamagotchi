"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { SignOutButton } from "@clerk/nextjs";
import { Doc } from "@/convex/_generated/dataModel";
import { getMoralStatsWritten } from "@/constants/morals";
import {
  EvolutionId,
  getEvolutionTimeFrame,
  getEvolution,
} from "@/constants/evolutions";

function SettingButtons() {
  const resetGame = useMutation(api.state.resetGame);
  return (
    <div className="fixed bottom-0 flex items-center right-0 px-4 py-2 gap-2">
      <a
        className="cursor-pointer"
        onClick={() => {
          if (window.confirm("Are you sure you want to reset the game?")) {
            resetGame();
            window.location.href = "/create";
          }
        }}
      >
        reset
      </a>
      <SignOutButton
        signOutOptions={{
          redirectUrl: "/",
        }}
      >
        <a className="cursor-pointer">log out</a>
      </SignOutButton>
    </div>
  );
}

export function Footer({
  pet,
  seenDilemmasCount,
}: {
  pet: Doc<"pets">;
  seenDilemmasCount: number;
}) {
  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  const moralStats = getMoralStatsWritten(pet.moralStats);
  return (
    <>
      <div className="fixed bottom-0 flex items-center right-0 px-4 py-2 gap-2">
        <SettingButtons />
        <div className="fixed bottom-0 max-w-lg items-center left-0 px-4 py-2 gap-2">
          {/* FACTS */}
          <p className="text-xl">{pet.name}</p>
          <p className="text-zinc-600">
            {evolution.description}. {pet.personality}
          </p>
          {/* MORAL STATS */}
          <p>
            {moralStats.length ? (
              moralStats.map(({ key, description, percentage }) => (
                <span
                  key={key}
                  title={`${percentage}%`}
                  className={`${
                    percentage > 60
                      ? "text-black"
                      : percentage > 30
                        ? "text-zinc-500"
                        : "text-zinc-400"
                  } mr-2`}
                >
                  {description}
                </span>
              ))
            ) : (
              <span className="text-zinc-400">moral uncertainty</span>
            )}
          </p>
          {/* EVOLUTION */}
          <p>
            {evolution.id}
            <br />
            {seenDilemmasCount} / {getEvolutionTimeFrame(pet.age)} dilemmas
            completed
          </p>
        </div>
      </div>
    </>
  );
}
