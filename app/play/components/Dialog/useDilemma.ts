import { getAverageMoralStats } from "@/app/api/dilemma/evolve";
import { useBaseStats, useDilemma, useOutcome, usePet } from "@/app/providers/PetProvider";
import { formatMoralStatsChange } from "@/app/utils/dilemma";
import { BaseStatKeys } from "@/constants/base";
import { useState } from "react";

export function useDilemmaSubmit() {
  const { pet, updatePet } = usePet();
  const { dilemma, setDilemma } = useDilemma();
  const { incrementStat } = useBaseStats();
  const { showOutcome } = useOutcome();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (responseText: string) => {
    if (!pet || !dilemma) {
      return;
    }

    setIsSubmitting(true);
    const newMessages = [
      ...dilemma.messages,
      { role: "user" as const, content: responseText },
    ];
    const newDilemma = {
      ...dilemma,
      messages: newMessages,
    };
    setDilemma(newDilemma);
    try {
      console.log("🚀 Submitting dilemma:", newDilemma);
      const response = await fetch("/api/dilemma", {
        method: "POST",
        body: JSON.stringify({
          pet,
          dilemma: newDilemma,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process response");
      }

      const data = await response.json();
      console.log("🚀 Response:", data);

      if (!data.ok) {
        // clarifying question
        const newDilemma = {
          ...dilemma,
          messages: [...newMessages, {
            role: "assistant" as const,
            content: data.outcome,
          }],
        };
        setDilemma(newDilemma);
        updatePet({
          ...pet,
          dilemmas: [...pet.dilemmas, newDilemma],
        });
        return;
      }

      // Finish the dilemma
      if (data.ok) {
        const newDilemma = {
          ...dilemma,
          messages: [...newMessages],
          stats: data.stats,
          consumed: true,
        };

        // add outcome with moral stats changes
        const newMoralStats = getAverageMoralStats([...pet.dilemmas, newDilemma]);
        const moralStatsChanges = formatMoralStatsChange(pet.moralStats, newMoralStats);
        const outcomeText = `${data.outcome} (${moralStatsChanges.join(", ")})`
        newDilemma.messages.push({
          role: "system" as const,
          content: outcomeText,
        });

        setDilemma(newDilemma);
        updatePet({
          ...pet,
          moralStats: newMoralStats,
          dilemmas: [...pet.dilemmas, newDilemma],
          ...(data.evolutionIds && { evolutionIds: data.evolutionIds }),
          ...(data.age !== undefined && { age: data.age }),
        });
        incrementStat(BaseStatKeys.sanity);
        showOutcome("success", outcomeText);
        setDilemma(null);
      }
    } catch (error) {
      console.error("❌ Error processing response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}