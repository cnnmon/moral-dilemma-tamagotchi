import { GameState } from "@/convex/state";
import { useEffect, useState } from "react";

interface OutcomeMessage {
  id: number;
  text: string;
  exitable: boolean;
}

const OUTCOMES_STORAGE_KEY = "pet-outcome-messages";

export function useOutcomes(stateResult: GameState | undefined) {
  const [clarifyingQuestion, setClarifyingQuestion] =
    useState<string | null>(null);
  const [outcomes, setOutcomes] = useState<OutcomeMessage[]>([]);
  const [nextId, setNextId] = useState(1);

  const addOutcome = (message: string) => {
    setOutcomes((prev) => [...prev, { id: nextId, text: message, exitable: true }]);
    setNextId((prev) => prev + 1);
  };

  const removeOutcome = (id: number) => {
    setOutcomes((prev) => prev.filter((outcome) => outcome.id !== id));
  };

  // load saved outcomes from local storage on mount
  useEffect(() => {
    const savedOutcomes = localStorage.getItem(OUTCOMES_STORAGE_KEY);
    if (savedOutcomes) {
      const parsed = JSON.parse(savedOutcomes);
      setOutcomes(parsed.outcomes);
      setNextId(parsed.nextId);
    }
  }, []);

  // add clarifying question outcome if the user has an unresolved dilemma
  useEffect(() => {
    if (stateResult?.status === "has_unresolved_dilemma") {
      const pet = stateResult.pet;
      setClarifyingQuestion(`${pet.name} looks up at you inquisitively. "${stateResult.question}"`);
    } else {
      setClarifyingQuestion(null);
    }
  }, [stateResult]);

  // save outcomes to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(
      OUTCOMES_STORAGE_KEY,
      JSON.stringify({ outcomes, nextId })
    );
  }, [outcomes, nextId]);

  const outcomesWithClarifyingQuestion = clarifyingQuestion
    ? [
        {
          id: 0,
          text: clarifyingQuestion,
          exitable: false,
        },
        ...outcomes,
      ]
    : outcomes;

  return {
    outcomes: outcomesWithClarifyingQuestion,
    addOutcome,
    removeOutcome,
  };
}
