import { useCallback, useEffect } from "react";
import { DilemmaTemplate } from "@/constants/dilemmas";
import { useState } from "react";
import { getRandomItem, hashString } from "./random";
import { GameState } from "@/convex/state";

const CURRENT_DILEMMA_KEY = "pet-current-dilemma";

export function useCurrentDilemma(stateResult: GameState | undefined) {
  const [currentDilemma, setCurrentDilemma] = useState<DilemmaTemplate | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSaveCurrentDilemma = useCallback((dilemma: DilemmaTemplate) => {
    setCurrentDilemma(dilemma);
    localStorage.setItem(CURRENT_DILEMMA_KEY, JSON.stringify(dilemma));
  }, []);

  const loadCurrentDilemma = useCallback((availableDilemmas: DilemmaTemplate[]) => {
    // either try to load from storage
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
    }

    // or pick a new one
    const seed = hashString("abcdef"); // TODO: randomize this
    const newDilemma = getRandomItem(availableDilemmas, seed);
    handleSaveCurrentDilemma(newDilemma);
  }, [handleSaveCurrentDilemma]);

  const onDilemmaProcessingStart = () => {
    setIsProcessing(true);
  };

  const onDilemmaProcessingEnd = () => {
    setIsProcessing(false);
    // clear current dilemma from storage to allow picking next one
    localStorage.removeItem(CURRENT_DILEMMA_KEY);
    setCurrentDilemma(null);
  };


  // handle dilemma selection and storage
  useEffect(() => {
    if (!stateResult) return;

    // handle unresolved dilemma case
    if (stateResult.status === "has_unresolved_dilemma") {
      handleSaveCurrentDilemma(stateResult.unresolvedDilemma);
      setIsProcessing(false);
      return;
    }

    // if we're processing a dilemma, don't change it
    if (isProcessing) return;

    // try to load saved dilemma if we don't have one
    if (!currentDilemma && stateResult.status === "has_dilemmas") {
      loadCurrentDilemma(stateResult.unseenDilemmas);
    }
  }, [stateResult, currentDilemma, handleSaveCurrentDilemma, loadCurrentDilemma, isProcessing]);

  return {
    currentDilemma,
    handleSaveCurrentDilemma,
    loadCurrentDilemma,
    onDilemmaProcessingStart,
    onDilemmaProcessingEnd,
    isProcessing,
  };
}
