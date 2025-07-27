import WindowTextarea from "@/components/WindowTextarea";
import { useDilemma, usePet } from "@/app/providers/PetProvider";
import { dilemmas } from "@/constants/dilemmas";
import { useDilemmaSubmit } from "./useDilemmaSubmit";

export default function Dialog() {
  const { pet } = usePet();
  const { dilemma } = useDilemma();
  const { handleSubmit, isSubmitting } = useDilemmaSubmit();

  if (!pet || !dilemma) {
    return null;
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
