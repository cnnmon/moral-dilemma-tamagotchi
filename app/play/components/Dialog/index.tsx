import { DilemmaTemplate } from "@/constants/dilemmas";
import Window from "@/components/Window";
import { BaseStatsType } from "@/constants/base";
import Choices from "@/components/Choices";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { Textarea } from "@/components/Textarea";

export default function Dialog({
  rip,
  isOpen,
  setIsOpen,
  petName,
  dilemma,
  onOutcome,
  onProcessingStart,
  onProcessingEnd,
  baseStats,
  disabled,
}: {
  rip: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  petName: string;
  dilemma: DilemmaTemplate | null;
  onOutcome: (outcome: string) => void;
  onProcessingStart: () => void;
  onProcessingEnd: () => void;
  baseStats: BaseStatsType;
  disabled: boolean;
}) {
  const [currentDilemmaId, setCurrentDilemmaId] = useState<
    string | undefined
  >();
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const submitResponse = useMutation(api.dilemmas.processDilemma);

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
    // resolved & outcome is the decision made
    else if (
      dilemmaUpdate.resolved &&
      dilemmaUpdate.outcome &&
      dilemmaUpdate.ok
    ) {
      console.log("🚀 Resolved dilemma:", dilemmaUpdate.outcome);
      onOutcome(dilemmaUpdate.outcome);
      setCurrentDilemmaId(undefined);
      setSelectedChoice(null);
      onProcessingEnd?.();
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dilemmaUpdate]);

  if (!dilemma) {
    return null;
  }

  const dilemmaText = dilemma.text.replace(/{pet}/g, petName);
  const handleSubmit = async (response: string) => {
    if (!response.trim()) {
      onOutcome("silence is not an option");
      return;
    }

    onProcessingStart?.();
    console.log("🚀 Submitting response:", response);

    if (selectedChoice === null) {
      onOutcome("you must select a choice");
      return;
    }

    try {
      const result = await submitResponse({
        dilemma: {
          title: dilemma.id,
          text: dilemmaText,
        },
        newBaseStats: baseStats,
        responseText: dilemma.responses[selectedChoice].text + ". " + response,
      });

      // store the dilemma id to subscribe to updates
      setCurrentDilemmaId(result.dilemmaId);
    } catch (error) {
      console.error("❌ Error processing response:", error);
      onOutcome("something went wrong! try again?");
      onProcessingEnd?.();
    }
  };

  if (rip) {
    return (
      <div className="flex w-full h-full">
        <p>rip</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-50">
      <Window
        title={`help ${petName} ! ! ! (；￣Д￣)`}
        isOpen={isOpen}
        setIsOpen={(isOpen) => {
          setIsOpen(isOpen);
          if (!isOpen) {
            setSelectedChoice(null);
          }
        }}
      >
        <Choices
          disabled={disabled}
          dilemmaText={dilemmaText}
          selectedChoice={selectedChoice}
          setSelectedChoice={setSelectedChoice}
          choices={dilemma.responses.map((response) => ({
            text: response.text.replace(/{pet}/g, petName),
          }))}
          handleSubmit={handleSubmit}
        />
      </Window>
      <div className="absolute bottom-0 left-0 w-full flex justify-center items-center">
        <div
          className="w-full max-w-2xl p-8 transition-all duration-300"
          style={{
            opacity: isOpen && selectedChoice !== null ? 1 : 0,
            transform:
              isOpen && selectedChoice !== null
                ? "translateY(0)"
                : "translateY(-5px)",
          }}
        >
          <Textarea
            placeholder={`as ${petName}'s caretaker, explain your choice...`}
            handleSubmit={(response) => handleSubmit(response)}
            isDisabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
