"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { DilemmaTemplate } from "@/constants/dilemmas";

interface DilemmaPromptProps {
  pet: Doc<"pets">;
  dilemma: DilemmaTemplate;
  onAnswered: () => void;
}

export function TextInput({ dilemma, onAnswered }: DilemmaPromptProps) {
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitResponse = useMutation(api.dilemmas.processDilemma);
  const [clarifyingQuestion, setClarifyingQuestion] = useState<
    string | undefined
  >();
  const [currentDilemma, setCurrentDilemma] =
    useState<DilemmaTemplate>(dilemma);
  const [currentDilemmaId, setCurrentDilemmaId] = useState<
    string | undefined
  >();

  // update current dilemma when prop changes and no active dilemma is being processed
  useEffect(() => {
    if (!currentDilemmaId && dilemma.id !== currentDilemma.id) {
      setCurrentDilemma(dilemma);
      setClarifyingQuestion(undefined);
      setResponse("");
    }
  }, [dilemma, currentDilemma.id, currentDilemmaId]);

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
      if (!dilemmaUpdate.ok) {
        // show clarifying question
        setClarifyingQuestion(dilemmaUpdate.outcome);
        toast.info(dilemmaUpdate.outcome, {
          position: "bottom-center",
          className: "font-pixel",
          duration: Infinity,
          dismissible: true,
        });
      } else {
        // clear input and show success
        setResponse("");
        setClarifyingQuestion(undefined);
        setCurrentDilemmaId(undefined);
        toast.success(dilemmaUpdate.outcome, {
          position: "bottom-center",
          className: "font-pixel",
          duration: Infinity,
          dismissible: true,
        });
        // notify parent that dilemma was answered
        onAnswered();
      }
      setIsSubmitting(false);
    }
  }, [dilemmaUpdate, onAnswered]);

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error("please write a response first!", {
        position: "bottom-center",
        className: "font-pixel",
        duration: Infinity,
        dismissible: true,
      });
      return;
    }

    setIsSubmitting(true);
    console.log("🚀 Submitting response:", response);

    try {
      const result = await submitResponse({
        dilemma: {
          title: currentDilemma.id,
          text: clarifyingQuestion
            ? `${currentDilemma.text}\n\n${clarifyingQuestion}`
            : currentDilemma.text,
        },
        responseText: response.trim(),
      });

      // store the dilemma id to subscribe to updates
      setCurrentDilemmaId(result.dilemmaId);
    } catch (error) {
      console.error("❌ Error processing response:", error);
      toast.error("something went wrong! try again?", {
        position: "bottom-center",
        className: "font-pixel",
        duration: Infinity,
        dismissible: true,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className={`w-full resize-none border-2 border-black outline-none p-2 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        disabled={isSubmitting}
        placeholder={isSubmitting ? "thinking..." : "what should they do?"}
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`bg-black text-white p-2 hover:bg-gray-800 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? "thinking..." : "submit"}
      </button>
    </div>
  );
}
