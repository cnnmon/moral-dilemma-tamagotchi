import { useCallback, useEffect } from "react";
import { DilemmaTemplate, dilemmaTemplates } from "@/constants/dilemmas";
import { useState } from "react";
import { getRandomItem } from "./random";
import { GameState } from "@/convex/state";

const CURRENT_DILEMMA_KEY = "pet-current-dilemma";

export function useCurrentDilemma({
  stateResult,
}: {
  stateResult: GameState | undefined;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDilemma, setCurrentDilemma] = useState<DilemmaTemplate | null>(
    null
  );
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);

  const handleSaveCurrentDilemma = useCallback((dilemma: DilemmaTemplate) => {
    setCurrentDilemma(dilemma);
    localStorage.setItem(CURRENT_DILEMMA_KEY, JSON.stringify(dilemma));
  }, []);

  const loadCurrentDilemma = useCallback((availableDilemmaTitles: string[]) => {
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
    const newDilemmaTitle = getRandomItem(availableDilemmaTitles);
    const newDilemma = dilemmaTemplates[newDilemmaTitle];
    handleSaveCurrentDilemma(newDilemma);
  }, [handleSaveCurrentDilemma]);

  const onDilemmaProcessingStart = () => {
    setIsProcessing(true);
    localStorage.setItem(CURRENT_DILEMMA_KEY, JSON.stringify(currentDilemma));
  };

  const onDilemmaProcessingEnd = () => {
    // clear current dilemma from storage to allow picking next one
    setIsProcessing(false);
    localStorage.removeItem(CURRENT_DILEMMA_KEY);
    setCurrentDilemma(null);
    setLastQuestion(null);
  };

  // handle dilemma selection and storage
  useEffect(() => {
    console.log("stateResult", stateResult);
    if (!stateResult || stateResult.status === "graduated") return;

    // handle unresolved dilemma case
    if (stateResult.status === "has_unresolved_dilemma") {
      console.log("has unresolved dilemma");
      handleSaveCurrentDilemma(stateResult.unresolvedDilemma);

      // if a new question has been asked
      // and we want to enable the user to respond
      console.log("lastQuestion", lastQuestion);
      console.log("stateResult.question", stateResult.question);
      if (lastQuestion !== stateResult.question) {
        setIsProcessing(false);
        setLastQuestion(stateResult.question);
      }
    }

    // if we're processing a dilemma, don't change it
    else if (isProcessing) return;

    // try to load saved dilemma if we don't have one
    else if (!currentDilemma && stateResult.status === "has_dilemmas") {
      loadCurrentDilemma(stateResult.unseenDilemmaTitles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateResult, currentDilemma]);

  return {
    currentDilemma,
    handleSaveCurrentDilemma,
    loadCurrentDilemma,
    onDilemmaProcessingStart,
    onDilemmaProcessingEnd,
    isProcessing,
  };
}
