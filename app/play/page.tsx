"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { OutcomePopup } from "./components/Outcome";
import Loading from "./components/Loading";
import { useOutcomes } from "./utils/useOutcomes";
import { useCurrentDilemma } from "./utils/useCurrentDilemma";
import Viewport from "./components/Viewport";
import DilemmaDisplay from "./components/DilemmaDisplay";
import Stats from "./components/Stats";
import { AnimatePresence, motion } from "framer-motion";

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

  const { pet, seenDilemmas } = stateResult;

  return (
    <AnimatePresence mode="wait">
      <div className="flex flex-col items-center gap-8 justify-center p-4 md:p-0 md:w-xl w-full">
        {/* Displays stats */}
        <motion.div
          className="md:absolute w-full h-full flex flex-col md:items-end md:p-4 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Stats pet={pet} seenDilemmasCount={seenDilemmas.length} />
        </motion.div>

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <DilemmaDisplay
            pet={pet}
            dilemma={currentDilemma}
            onOutcome={addOutcome}
            onProcessingStart={onDilemmaProcessingStart}
            onProcessingEnd={onDilemmaProcessingEnd}
            disabled={isProcessing} // disable the button when processing
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
