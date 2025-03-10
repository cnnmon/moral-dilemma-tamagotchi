import { useCallback, useEffect, useState } from "react";
import { DilemmaTemplate, dilemmaTemplates } from "@/constants/dilemmas";
import { getRandomItem } from "./random";
import { GameState } from "@/convex/state";

const CURRENT_DILEMMA_KEY = "pet-current-dilemma";
const LOCALSTORAGE_DEBOUNCE_MS = 1000;

// debounced local storage function
function useDebounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  return useCallback((...args: Args) => {
    if (timer) {
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(() => {
        callback(...args);
      }, delay)
    );
  }, [callback, delay, timer]);
}

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

  // debounce localStorage operations
  const debouncedSaveDilemma = useDebounce((dilemma: DilemmaTemplate | null) => {
    if (dilemma) {
      localStorage.setItem(CURRENT_DILEMMA_KEY, JSON.stringify(dilemma));
    } else {
      localStorage.removeItem(CURRENT_DILEMMA_KEY);
    }
  }, LOCALSTORAGE_DEBOUNCE_MS);

  const handleSaveCurrentDilemma = useCallback((dilemma: DilemmaTemplate) => {
    setCurrentDilemma(dilemma);
    if (dilemma) {
      localStorage.setItem(CURRENT_DILEMMA_KEY, JSON.stringify(dilemma));

    } else {
      debouncedSaveDilemma(null);
    }
  }, [debouncedSaveDilemma]);

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

  const onDilemmaProcessingStart = useCallback(() => {
    setIsProcessing(true);
    if (currentDilemma) {
      debouncedSaveDilemma(currentDilemma);
    }
  }, [currentDilemma, debouncedSaveDilemma]);

  const onDilemmaProcessingEnd = useCallback(() => {
    // clear current dilemma from storage to allow picking next one
    setIsProcessing(false);
    debouncedSaveDilemma(null);
    setCurrentDilemma(null);
    setLastQuestion(null);
  }, [debouncedSaveDilemma]);

  // handle dilemma selection and storage
  useEffect(() => {
    if (!stateResult || stateResult.status === "graduated") return;

    // handle unresolved dilemma case
    if (stateResult.status === "has_unresolved_dilemma") {
      handleSaveCurrentDilemma(stateResult.unresolvedDilemma);

      // if a new question has been asked
      // and we want to enable the user to respond
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
  }, [stateResult, currentDilemma, isProcessing, handleSaveCurrentDilemma, lastQuestion, loadCurrentDilemma]);

  return {
    currentDilemma,
    handleSaveCurrentDilemma,
    loadCurrentDilemma,
    onDilemmaProcessingStart,
    onDilemmaProcessingEnd,
    isProcessing,
  };
}
