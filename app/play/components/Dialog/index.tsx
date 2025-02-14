import { DilemmaTemplate } from "@/constants/dilemmas";
import { Input } from "./Input";
import { Doc } from "@/convex/_generated/dataModel";
import Window from "@/components/Window";
import { BaseStatsType } from "@/constants/base";

export default function Dialog({
  pet,
  rip,
  dilemma,
  onOutcome,
  onProcessingStart,
  onProcessingEnd,
  disabled,
  baseStats,
}: {
  pet: Doc<"pets">;
  rip: boolean;
  dilemma: DilemmaTemplate | null;
  onOutcome: (message: string) => void;
  onProcessingStart: () => void;
  onProcessingEnd: () => void;
  disabled: boolean;
  baseStats: BaseStatsType;
}) {
  if (!dilemma) {
    return null;
  }

  if (rip) {
    return (
      <Window title={`${pet.name} has died (◞‸◟；)`}>
        <p>
          rip. maybe you should have taken better care of {pet.name} instead of
          answering all those dilemmas...
        </p>
        <a onClick={() => window.location.reload()}>
          try again with {pet.name}
        </a>{" "}
        or <a href="/create">adopt a new pet</a>
      </Window>
    );
  }

  return (
    <Window title={`help ${pet.name} ! ! ! (；￣Д￣)`}>
      <p>{dilemma.text.replace(/{pet}/g, pet.name)}</p>
      <Input
        dilemma={dilemma}
        onOutcome={onOutcome}
        onProcessingStart={onProcessingStart}
        onProcessingEnd={onProcessingEnd}
        disabled={disabled}
        baseStats={baseStats}
      />
    </Window>
  );
}
