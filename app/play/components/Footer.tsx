"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { SignOutButton } from "@clerk/nextjs";
import { Doc } from "@/convex/_generated/dataModel";
import { getMoralStatsWritten } from "@/constants/morals";
import { EvolutionId, getEvolution } from "@/constants/evolutions";

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

export function Footer({ pet }: { pet: Doc<"pets"> }) {
  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  const moralStats = getMoralStatsWritten(pet.moralStats);
  return (
    <>
      <div className="fixed bottom-0 flex items-center right-0 px-4 py-2 gap-2">
        <SettingButtons />
        <div className="fixed bottom-0 max-w-lg items-center left-0 px-4 py-2 gap-2">
          {/* FACTS */}
          <p className="text-xl">{pet.name}</p>
          <p className="text-gray-600">
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
                        ? "text-gray-500"
                        : "text-gray-400"
                  } mr-2`}
                >
                  {description}
                </span>
              ))
            ) : (
              <span className="text-gray-400">moral uncertainty</span>
            )}
          </p>
          {/* EVOLUTION */}
          <p>
            stage {pet.age}: {evolution.id} / 50%
          </p>
        </div>
      </div>
    </>
  );
}
