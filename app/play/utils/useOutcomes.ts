import { useEffect, useState } from "react";

interface OutcomeMessage {
  id: number;
  text: string;
  exitable: boolean;
}

const OUTCOMES_STORAGE_KEY = "pet-outcome-messages";

export function useOutcomes() {
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

  // save outcomes to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(
      OUTCOMES_STORAGE_KEY,
      JSON.stringify({ outcomes, nextId })
    );
  }, [outcomes, nextId]);

  return {
    outcomes,
    addOutcome,
    removeOutcome,
  };
}
