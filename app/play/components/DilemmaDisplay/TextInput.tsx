"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DilemmaTemplate } from "@/constants/dilemmas";

const thinkingFlavorText = ["thinking...", "chewing on it...", "pondering..."];

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
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitResponse = useMutation(api.dilemmas.processDilemma);
  const [currentDilemmaId, setCurrentDilemmaId] = useState<
    string | undefined
  >();
  const [flavorTextIndex, setFlavorTextIndex] = useState(0);

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
      setResponse("");
      setIsSubmitting(false);
    }

    // resolved & outcome is the decision made
    if (dilemmaUpdate.resolved && dilemmaUpdate.outcome && dilemmaUpdate.ok) {
      setResponse("");
      onOutcome(dilemmaUpdate.outcome);
      setCurrentDilemmaId(undefined);
      onProcessingEnd?.();
    }
  }, [dilemmaUpdate, onOutcome, onProcessingEnd]);

  // rotate thinking flavor text every second
  useEffect(() => {
    if (isSubmitting) {
      const intervalId = setInterval(() => {
        setFlavorTextIndex(
          (prevIndex) => (prevIndex + 1) % thinkingFlavorText.length
        );
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isSubmitting]);

  const handleSubmit = async () => {
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  const isDisabled = disabled || isSubmitting;

  return (
    <div className="flex flex-col my-2">
      <textarea
        className={`resize-none border-2 border-black bg-zinc-200 outline-none p-2 ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isDisabled}
        placeholder="speak your truth"
      />
      <div className="flex justify-end">
        <p className="text-zinc-400 text-sm mt-[-32px] p-2 absolute">
          {!isSubmitting ? (
            <>enter to submit</>
          ) : (
            <span className="opacity-50 cursor-not-allowed pointer-events-none">
              {thinkingFlavorText[flavorTextIndex]}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
