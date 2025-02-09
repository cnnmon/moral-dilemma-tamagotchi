"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { TextInput } from "./components/TextInput";
import { OutcomePopup } from "./components/Outcome";
import { Footer } from "./components/Footer";
import Loading from "./components/Loading";
import { useOutcomes } from "./utils/useOutcomes";
import { useCurrentDilemma } from "./utils/useCurrentDilemma";

export default function Play() {
  const stateResult = useQuery(api.state.getActiveGameState);
  const { outcomes, addOutcome, removeOutcome } = useOutcomes();
  const {
    currentDilemma,
    onDilemmaProcessingStart,
    onDilemmaProcessingEnd,
    isProcessing,
  } = useCurrentDilemma(stateResult);

  if (stateResult === undefined) {
    return <Loading />;
  }

  const { status } = stateResult;

  // auth state
  if (status === "not_authenticated") {
    window.location.href = "/";
    return <Loading />;
  }

  // no pet state
  if (status === "needs_pet") {
    window.location.href = "/create";
    return <Loading />;
  }

  // if no current dilemma, show loading
  if (!currentDilemma) {
    return <div>choosing next dilemma...</div>;
  }

  const pet = stateResult.pet;
  return (
    <div className="flex flex-col items-center gap-2 h-screen justify-center">
      <Footer pet={pet} />
      <div className="fixed top-0 p-4">
        {outcomes.map((outcome) => (
          <OutcomePopup
            key={outcome.id}
            message={outcome.text}
            onClose={() => removeOutcome(outcome.id)}
          />
        ))}
      </div>

      <Image
        src="/birb_smol.gif"
        alt="birb"
        width={150}
        height={150}
        unoptimized
      />

      <p className="w-full text-md">
        {currentDilemma.text.replace(/{pet}/g, pet.name)}
      </p>

      {status === "has_unresolved_dilemma" && (
        <div className="w-full font-pixel">
          {pet.name} looks up at you. &quot;{stateResult.question}&quot;
        </div>
      )}

      <TextInput
        dilemma={currentDilemma}
        onOutcome={addOutcome}
        onProcessingStart={onDilemmaProcessingStart}
        onProcessingEnd={onDilemmaProcessingEnd}
        disabled={status === "out_of_dilemmas" || isProcessing}
      />
    </div>
  );
}
