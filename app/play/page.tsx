"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { OutcomePopup } from "./components/Outcome";
import { Footer } from "./components/Footer";
import Loading from "./components/Loading";
import { useOutcomes } from "./utils/useOutcomes";
import { useCurrentDilemma } from "./utils/useCurrentDilemma";
import Viewport from "./components/Viewport";
import DilemmaDisplay from "./components/DilemmaDisplay";
import Stats from "./components/Stats";

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

  // if out of dilemmas, note that
  if (status === "out_of_dilemmas") {
    return <div>you&apos;ve seen all the dilemmas!</div>;
  }

  // if no current dilemma, show loading
  if (!currentDilemma) {
    return <div>choosing next dilemma...</div>;
  }

  const { pet, seenDilemmas } = stateResult;

  return (
    <div className="flex flex-col items-center gap-8 justify-center p-4 md:p-0 md:w-xl w-full">
      {/* Displays setting buttons */}
      <Footer />

      {/* Displays stats */}
      <Stats pet={pet} seenDilemmasCount={seenDilemmas.length} />

      {/* Displays outcomes */}
      <div className="fixed top-0 p-4 w-full max-w-xl z-10">
        {outcomes.map((outcome) => (
          <OutcomePopup
            key={outcome.id}
            message={outcome.text}
            exitable={outcome.exitable}
            onClose={() => removeOutcome(outcome.id)}
          />
        ))}
      </div>

      {/* Displays the pet & background */}
      <Viewport
        clarifyingQuestion={
          status === "has_unresolved_dilemma" ? stateResult.question : null
        }
      />

      {/* Displays dilemma */}
      <DilemmaDisplay
        pet={pet}
        dilemma={currentDilemma}
        onOutcome={addOutcome}
        onProcessingStart={onDilemmaProcessingStart}
        onProcessingEnd={onDilemmaProcessingEnd}
        disabled={isProcessing}
      />
    </div>
  );
}
