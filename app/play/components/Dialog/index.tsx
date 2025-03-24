import { DilemmaTemplate } from "@/constants/dilemmas";
import { BaseStatsType } from "@/constants/base";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import WindowTextarea from "@/components/WindowTextarea";
import Window from "@/components/Window";

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

    // create a timeout promise that rejects after 15 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("request timed out"));
      }, 15000); // 15 seconds timeout
    });

    try {
      // race the api call against the timeout
      const result = (await Promise.race([
        submitResponse({
          dilemma: {
            title: dilemma.id,
            text: dilemmaText,
          },
          newBaseStats: baseStats,
          responseText: response,
        }),
        timeoutPromise,
      ])) as Awaited<ReturnType<typeof submitResponse>>;

      // store the dilemma id to subscribe to updates
      setCurrentDilemmaId(result.dilemmaId);
    } catch (error) {
      console.error("❌ Error processing response:", error);

      // specific error message for timeout
      if (error instanceof Error && error.message === "request timed out") {
        onOutcome("the request took too long. please try again!");
      } else {
        onOutcome("something went wrong! try again?");
      }

      // ensure processing is ended and dialog is closed on error
      onProcessingEnd?.();
      setCurrentDilemmaId(undefined);
    }
  };

  if (rip) {
    return (
      <div className="flex w-full h-full">
        <Window title={`${petName} has died :(`}>
          <p>maybe you should take better care of them next time...</p>
          <div className="flex flex-col">
            <a href="/create">adopt a new pet</a>
            <a onClick={() => window.location.reload()} className="underline">
              use dark magic to revive {petName}
            </a>
          </div>
        </Window>
      </div>
    );
  }

  return (
    <div className="flex w-full h-50">
      <WindowTextarea
        title={`help ${petName} ! ! ! (；￣Д￣)`}
        isOpen={isOpen}
        setIsOpen={(isOpen) => {
          setIsOpen(isOpen);
        }}
        isTextareaOpen={true}
        placeholder={`as ${petName}'s caretaker, explain your choice...`}
        handleSubmit={handleSubmit}
        isDisabled={disabled}
      >
        <p>{dilemmaText}</p>
      </WindowTextarea>
    </div>
  );
}
