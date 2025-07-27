import WindowTextarea from "@/components/WindowTextarea";
import Window from "@/components/Window";
import { EvolutionId } from "@/constants/evolutions";
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

  if (pet.evolutionIds.includes(EvolutionId.RIP)) {
    return (
      <div className="flex w-full h-full">
        <Window title={`${pet.name} has died :(`}>
          <div className="flex flex-col p-3">
            <p>maybe you should take better care of them next time...</p>
            <div className="flex flex-col">
              <a href="/create">adopt a new pet</a>
              <a onClick={() => window.location.reload()} className="underline">
                use dark magic to revive {pet.name}
              </a>
            </div>
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
