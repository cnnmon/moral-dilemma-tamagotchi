"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DilemmaTemplate } from "@/constants/dilemmas";
import { Textarea } from "@/components/Textarea";

interface TextInputProps {
  dilemma: DilemmaTemplate;
  onOutcome: (message: string) => void;
  onProcessingStart?: () => void;
  onProcessingEnd?: () => void;
  disabled?: boolean;
}

export function TextInput({
  dilemma,
  onOutcome,
  onProcessingStart,
  onProcessingEnd,
  disabled = false,
}: TextInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitResponse = useMutation(api.dilemmas.processDilemma);
  const [currentDilemmaId, setCurrentDilemmaId] = useState<
    string | undefined
  >();

  // subscribe to updates for the current dilemma
  const dilemmaUpdate = useQuery(
    api.dilemmas.getDilemmaById,
    currentDilemmaId
      ? { dilemmaId: currentDilemmaId as Id<"dilemmas"> }
      : "skip"
  );

  // when we get an update and it's resolved, show the outcome
  useEffect(() => {
    if (!dilemmaUpdate) return;

    // clarifying question
    if (!dilemmaUpdate.resolved && dilemmaUpdate.outcome) {
      setIsSubmitting(false);
    }

    // resolved & outcome is the decision made
    else if (
      dilemmaUpdate.resolved &&
      dilemmaUpdate.outcome &&
      dilemmaUpdate.ok
    ) {
      onOutcome(dilemmaUpdate.outcome);
      setCurrentDilemmaId(undefined);
      onProcessingEnd?.();
    }
  }, [dilemmaUpdate, onOutcome, onProcessingEnd]);

  const handleSubmit = async (response: string) => {
    if (!response.trim()) {
      onOutcome("silence is not an option");
      return;
    }

    setIsSubmitting(true);
    onProcessingStart?.();
    console.log("🚀 Submitting response:", response);

    try {
      const result = await submitResponse({
        dilemma: {
          title: dilemma.id,
          text: dilemma.text,
        },
        responseText: response.trim(),
      });

      // store the dilemma id to subscribe to updates
      setCurrentDilemmaId(result.dilemmaId);
    } catch (error) {
      console.error("❌ Error processing response:", error);
      onOutcome("something went wrong! try again?");
      setIsSubmitting(false);
      onProcessingEnd?.();
    }
  };

  const isDisabled = disabled || isSubmitting;

  return (
    <Textarea
      placeholder="speak your truth"
      handleSubmit={handleSubmit}
      isDisabled={isDisabled}
      isSubmitting={isSubmitting}
    />
  );
}
