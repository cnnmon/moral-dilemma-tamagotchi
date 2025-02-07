"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DilemmaTemplate } from "@/constants/dilemmas";

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

    if (dilemmaUpdate.resolved && dilemmaUpdate.outcome) {
      onOutcome(dilemmaUpdate.outcome);
      setResponse("");

      if (dilemmaUpdate.ok) {
        // if the response was accepted (not a clarifying question)
        setCurrentDilemmaId(undefined);
        setIsSubmitting(false);
        onProcessingEnd?.();
      } else {
        // if it was a clarifying question, just reset submit state
        setIsSubmitting(false);
      }
    }
  }, [dilemmaUpdate, onOutcome, onProcessingEnd]);

  const handleSubmit = async () => {
    if (!response.trim()) {
      onOutcome("silence is not an option :(");
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
    <div className="flex flex-col gap-2 w-full">
      <textarea
        className={`w-full resize-none border-2 border-black rounded-md outline-none p-2 ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isDisabled}
        placeholder={isSubmitting ? "thinking..." : "speak your truth"}
      />
      <div className="flex justify-end">
        <p className="text-gray-600">
          press enter or click{" "}
          <a
            onClick={handleSubmit}
            className={`hover:underline ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "thinking..." : "submit"}
          </a>
        </p>
      </div>
    </div>
  );
}
