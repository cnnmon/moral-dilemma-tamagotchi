import WindowTextarea from "@/components/WindowTextarea";
import Window from "@/components/Window";
import { EvolutionId } from "@/constants/evolutions";
import { useDilemma, usePet, useOutcome } from "@/app/providers/PetProvider";
import { dilemmas } from "@/constants/dilemmas";
import { useState } from "react";
import {
  formatMoralStatsChange,
  getRandomUnseenDilemma,
} from "@/app/utils/dilemma";
import { MoralDimensionsType } from "@/constants/morals";

interface DilemmaResponse {
  ok: boolean;
  outcome: string;
  stats?: Partial<MoralDimensionsType>;
  personality?: string;
  newBaseStats?: {
    health: number;
    hunger: number;
    happiness: number;
    sanity: number;
  };
  override?: boolean;
  // Evolution fields
  moralStats?: MoralDimensionsType;
  evolutionIds?: EvolutionId[];
  age?: number;
}

export default function Dialog() {
  const { pet, updatePet } = usePet();
  const { dilemma, setDilemma } = useDilemma();
  const { showOutcome } = useOutcome();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!pet || !dilemma) {
    return null;
  }

  const handleSubmit = async (responseText: string) => {
    if (!dilemma) {
      console.error("❌ No dilemma to submit response to");
      return;
    }

    if (!responseText.trim()) {
      showOutcome("error", "silence is not an option");
      return;
    }

    setIsSubmitting(true);

    const fullDilemma = dilemmas[dilemma.id];
    if (!fullDilemma) {
      console.error("❌ Dilemma not found");
      setIsSubmitting(false);
      return;
    }

    // Build the current messages array for the API
    // The API expects: [user response, clarifying question?, user follow-up?]
    const messages = [];

    // Add previous user responses if this is a clarifying question flow
    const userMessages = dilemma.messages.filter((msg) => msg.role === "user");
    if (userMessages.length > 0) {
      messages.push(...userMessages);
    }

    // Add current user response
    messages.push({
      role: "user" as const,
      content: responseText,
    });

    // Add clarifying question if it exists
    const clarifyingQuestion = dilemma.messages.find(
      (msg) => msg.role === "assistant"
    );
    if (clarifyingQuestion) {
      messages.push({
        role: "assistant" as const,
        content: clarifyingQuestion.content,
      });
    }

    try {
      const response = await fetch("/api/dilemma", {
        method: "POST",
        body: JSON.stringify({
          dilemma: dilemma.id,
          pet,
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process response");
      }

      const data: DilemmaResponse = await response.json();
      console.log("🚀 Response:", data);

      if (data.ok) {
        // Pet accepted the advice - complete the dilemma
        const statsChanges = data.stats
          ? formatMoralStatsChange(pet.moralStats, {
              ...pet.moralStats,
              ...data.stats,
            })
          : [];

        // Show outcome with moral stats changes
        let outcomeMessage = data.outcome;
        if (statsChanges.length > 0) {
          outcomeMessage += `\n\n${statsChanges.join(", ")}`;
        }

        // Update pet with new stats and add completed dilemma to history
        const completedDilemma = {
          ...dilemma,
          messages: [...messages],
          stats: { ...pet.moralStats, ...data.stats },
        };

        // Check if evolution occurred
        if (
          data.evolutionIds &&
          data.evolutionIds.length > pet.evolutionIds.length
        ) {
          const newEvolution = data.evolutionIds[data.evolutionIds.length - 1];
          console.log(
            `🎉 ${pet.name} evolved to ${newEvolution} at age ${data.age}!`
          );
          outcomeMessage += `\n\nand ${pet.name} evolved to ${newEvolution}!`;
        }

        const updatedPet = {
          // Use evolution stats if provided (averaged), otherwise just add new stats
          moralStats: data.moralStats || { ...pet.moralStats, ...data.stats },
          personality: data.personality || pet.personality,
          baseStats: data.newBaseStats || pet.baseStats,
          dilemmas: [...pet.dilemmas, completedDilemma],
          // Handle evolution updates
          ...(data.evolutionIds && { evolutionIds: data.evolutionIds }),
          ...(data.age !== undefined && { age: data.age }),
        };

        updatePet(updatedPet);

        // Show the outcome and get a new dilemma
        showOutcome("success", outcomeMessage, 3000);

        // Get a new dilemma that hasn't been seen
        const newDilemma = getRandomUnseenDilemma({
          ...pet,
          dilemmas: [...pet.dilemmas, completedDilemma],
        });

        setTimeout(() => {
          if (newDilemma) {
            setDilemma(newDilemma);
          } else {
            // No more dilemmas available
            setDilemma(null);
          }
        }, 100); // Short delay to allow outcome to show
      } else {
        // Pet needs convincing - show clarifying question and update messages
        const updatedMessages = [
          ...messages,
          {
            role: "assistant" as const,
            content: data.outcome,
          },
        ];

        setDilemma({
          ...dilemma,
          messages: updatedMessages,
        });
      }
    } catch (error) {
      console.error("❌ Error processing response:", error);

      // Show error message
      const errorMessage =
        error instanceof Error && error.message === "request timed out"
          ? "❌ The request took too long. please try again!"
          : "❌ Something went wrong! try again?";

      showOutcome("error", errorMessage, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pet.evolutionIds.includes(EvolutionId.RIP)) {
    return (
      <div className="flex w-full h-full">
        <Window title={`${pet.name} has died :(`}>
          <p>maybe you should take better care of them next time...</p>
          <div className="flex flex-col">
            <a href="/create">adopt a new pet</a>
            <a onClick={() => window.location.reload()} className="underline">
              use dark magic to revive {pet.name}
            </a>
          </div>
        </Window>
      </div>
    );
  }

  // Get the display text based on current conversation state
  const displayText = dilemmas[dilemma.id]?.text.replaceAll("{pet}", pet.name);
  const placeholder = `as ${pet.name}'s caretaker, explain your advice...`;

  return (
    <div className="flex w-full h-50 text-lg">
      <WindowTextarea
        key={dilemma.id} // Force remount when dilemma changes to clear textarea
        title={`help ${pet.name} ! ! ! (；￣Д￣)`}
        placeholder={isSubmitting ? "thinking..." : placeholder}
        handleSubmit={isSubmitting ? () => {} : handleSubmit}
        disabled={isSubmitting}
      >
        <p>{displayText}</p>
      </WindowTextarea>
    </div>
  );
}
