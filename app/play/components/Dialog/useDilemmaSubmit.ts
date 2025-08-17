import { getAverageMoralStats } from "@/app/api/dilemma/evolve";
import { useBaseStats, useDilemma, useOutcome, usePet } from "@/app/providers/PetProvider";
import { formatMoralStatsChange } from "@/app/utils/dilemma";
import { BaseStatKeys } from "@/constants/base";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useDilemmaSubmit() {
  const { pet, updatePet } = usePet();
  const { dilemma, setDilemma } = useDilemma();
  const { incrementStat, incrementStatBy } = useBaseStats();
  const { showOutcome } = useOutcome();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const trackResponse = useMutation(api.dilemmas.trackDilemmaResponse);

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
    
    let trackResult: { success: boolean; dilemmaId: Id<"dilemmas"> } | undefined;
    
    try {
      console.log("🚀 Submitting dilemma:", newDilemma);
      
      // Track the response in Convex with the full dialogue so far
      trackResult = await trackResponse({
        title: dilemma.id,
        responseText,
        messages: newMessages,
        resolved: false,
      });

      // Continue with local API processing
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
        
        // Update the same Convex record with the clarifying question
        try {
          await trackResponse({
            id: trackResult?.dilemmaId,
            title: dilemma.id,
            responseText,
            outcome: data.outcome,
            messages: newDilemma.messages,
            resolved: false, // Still not resolved, just a clarifying question
          });
        } catch (e) {
          console.warn("Failed to update clarifying question in Convex", e);
        }
        
        // Increase sanity by half the amount of a fully completed dilemma
        incrementStatBy(BaseStatKeys.sanity, 1.5);
        return;
      }

      // Finish the dilemma
      if (data.ok) {
        const newDilemma = {
          ...dilemma,
          messages: [...newMessages],
          stats: data.stats || {},
          completed: true,
        };

        // add outcome with moral stats changes
        const newMoralStats = data.stats ? getAverageMoralStats([...pet.dilemmas, newDilemma]) : pet.moralStats;
        const moralStatsChanges = data.stats ? formatMoralStatsChange(pet.moralStats, newMoralStats).join(", ").trim() : "";
        const outcomeText = `${data.outcome}${moralStatsChanges ? ` (${moralStatsChanges})` : ""}`
        newDilemma.messages.push({
          role: "system" as const,
          content: outcomeText,
        });

        setDilemma(newDilemma);
        updatePet({
          ...pet,
          personality: data.personality,
          moralStats: data.stats ? newMoralStats : pet.moralStats,
          dilemmas: [...pet.dilemmas, newDilemma],
          ...(data.evolutionIds && { evolutionIds: data.evolutionIds }),
          ...(data.age !== undefined && { age: data.age }),
        });

        // Persist final outcome + updates back to Convex
        try {
          await trackResponse({
            id: trackResult?.dilemmaId,
            title: dilemma.id,
            responseText,
            outcome: data.outcome,
            messages: newDilemma.messages,
            updatedMoralStats: data.stats ?? undefined,
            updatedPersonality: data.personality ?? undefined,
            resolved: true,
          });
        } catch (e) {
          console.warn("Failed to persist final dilemma outcome to Convex", e);
        }
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