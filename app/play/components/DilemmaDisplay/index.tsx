import { DilemmaTemplate } from "@/constants/dilemmas";
import { TextInput } from "./TextInput";
import { Doc } from "@/convex/_generated/dataModel";
import Window from "@/components/Window";
export default function DilemmaDisplay({
  pet,
  dilemma,
  onOutcome,
  onProcessingStart,
  onProcessingEnd,
  disabled,
}: {
  pet: Doc<"pets">;
  dilemma: DilemmaTemplate;
  onOutcome: (message: string) => void;
  onProcessingStart: () => void;
  onProcessingEnd: () => void;
  disabled: boolean;
}) {
  return (
    <Window title={`help ${pet.name} ! ! ! (；￣Д￣)`}>
      <p>{dilemma.text.replace(/{pet}/g, pet.name)}</p>
      <TextInput
        dilemma={dilemma}
        onOutcome={onOutcome}
        onProcessingStart={onProcessingStart}
        onProcessingEnd={onProcessingEnd}
        disabled={disabled}
      />
    </Window>
  );
}
