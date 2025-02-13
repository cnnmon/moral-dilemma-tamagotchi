import { DilemmaTemplate } from "@/constants/dilemmas";
import { TextInput } from "./TextInput";
import { Doc } from "@/convex/_generated/dataModel";

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
    <div className="w-full border-2 border-black bg-zinc-100">
      <div className="flex flex-col px-3 py-1 border-b-2 border-black">
        <p>help {pet.name} ! ! ! (；￣Д￣)</p>
      </div>
      <div className="px-3 py-2">
        <p>{dilemma.text.replace(/{pet}/g, pet.name)}</p>
        <TextInput
          dilemma={dilemma}
          onOutcome={onOutcome}
          onProcessingStart={onProcessingStart}
          onProcessingEnd={onProcessingEnd}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
