"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { TextInput } from "./components/TextInput";
import { OutcomePopup } from "./components/OutcomePopup";
import { useState, useEffect } from "react";
import { DilemmaTemplate } from "@/constants/dilemmas";

interface OutcomeMessage {
  id: number;
  text: string;
}

const OUTCOMES_STORAGE_KEY = "pet-outcome-messages";
const CURRENT_DILEMMA_KEY = "pet-current-dilemma";

// simple hash function for seeding random selection
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

// get random item using a seed
function getRandomItem<T>(items: T[], seed: number): T {
  const index = Math.abs(seed) % items.length;
  return items[index];
}

export default function Play() {
  const stateResult = useQuery(api.state.getActiveGameState);
  const [outcomes, setOutcomes] = useState<OutcomeMessage[]>([]);
  const [nextId, setNextId] = useState(0);
  const [currentDilemma, setCurrentDilemma] = useState<DilemmaTemplate | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // load saved outcomes from local storage on mount
  useEffect(() => {
    const savedOutcomes = localStorage.getItem(OUTCOMES_STORAGE_KEY);
    if (savedOutcomes) {
      const parsed = JSON.parse(savedOutcomes);
      setOutcomes(parsed.outcomes);
      setNextId(parsed.nextId);
    }
  }, []);

  // save outcomes to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(
      OUTCOMES_STORAGE_KEY,
      JSON.stringify({ outcomes, nextId })
    );
  }, [outcomes, nextId]);

  // handle dilemma selection and storage
  useEffect(() => {
    if (!stateResult) return;

    // handle unresolved dilemma case
    if (stateResult.status === "has_unresolved_dilemma") {
      setCurrentDilemma(stateResult.dilemma);
      localStorage.setItem(
        CURRENT_DILEMMA_KEY,
        JSON.stringify(stateResult.dilemma)
      );
      return;
    }

    // if we're processing a dilemma, don't change it
    if (isProcessing) return;

    // try to load saved dilemma if we don't have one
    if (!currentDilemma) {
      const savedDilemma = localStorage.getItem(CURRENT_DILEMMA_KEY);
      if (savedDilemma) {
        try {
          const parsed = JSON.parse(savedDilemma);
          if (
            parsed &&
            typeof parsed === "object" &&
            "id" in parsed &&
            "text" in parsed
          ) {
            setCurrentDilemma(parsed as DilemmaTemplate);
          }
        } catch (e) {
          console.error("Failed to parse saved dilemma:", e);
        }
        return;
      }
    }

    // if we still don't have a dilemma and there are available ones, pick one
    if (!currentDilemma && stateResult.status === "has_dilemmas") {
      const seed = hashString(
        stateResult.pet.name + stateResult.dilemmas.length
      );
      const newDilemma = getRandomItem(stateResult.dilemmas, seed);
      setCurrentDilemma(newDilemma);
      localStorage.setItem(CURRENT_DILEMMA_KEY, JSON.stringify(newDilemma));
    }
  }, [stateResult, currentDilemma, isProcessing]);

  const addOutcome = (message: string) => {
    setOutcomes((prev) => [...prev, { id: nextId, text: message }]);
    setNextId((prev) => prev + 1);
  };

  const removeOutcome = (id: number) => {
    setOutcomes((prev) => prev.filter((outcome) => outcome.id !== id));
  };

  const onDilemmaProcessingStart = () => {
    setIsProcessing(true);
  };

  const onDilemmaProcessingEnd = () => {
    setIsProcessing(false);
    // clear current dilemma from storage to allow picking next one
    localStorage.removeItem(CURRENT_DILEMMA_KEY);
    setCurrentDilemma(null);
  };

  if (stateResult === undefined) {
    return <div>loading...</div>;
  }

  const { status } = stateResult;

  // auth state
  if (status === "not_authenticated") {
    window.location.href = "/";
    return null;
  }

  // no pet state
  if (status === "needs_pet") {
    window.location.href = "/create";
    return null;
  }

  // if no current dilemma, show loading
  if (!currentDilemma) {
    return <div>choosing next dilemma...</div>;
  }

  // get pet from state result
  const pet = "pet" in stateResult ? stateResult.pet : null;
  if (!pet) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        src="/birb_smol.gif"
        alt="birb"
        width={200}
        height={200}
        unoptimized
      />

      <div className="w-full flex flex-col gap-2">
        {outcomes.map((outcome) => (
          <OutcomePopup
            key={outcome.id}
            message={outcome.text}
            onClose={() => removeOutcome(outcome.id)}
          />
        ))}
      </div>

      <div className="w-full">
        <p className="text-xl font-bold">{pet.name}</p>
        <p className="text-sm text-gray-600">{pet.personality}</p>
      </div>

      <div className="w-full">
        {currentDilemma.text.replace(/{pet}/g, pet.name)}
      </div>

      {status === "has_unresolved_dilemma" && (
        <div className="w-full text-orange-500 font-pixel">
          {stateResult.question}
        </div>
      )}

      <TextInput
        dilemma={currentDilemma}
        onOutcome={addOutcome}
        onProcessingStart={onDilemmaProcessingStart}
        onProcessingEnd={onDilemmaProcessingEnd}
        disabled={status === "out_of_dilemmas" || isProcessing}
      />
    </div>
  );
}
