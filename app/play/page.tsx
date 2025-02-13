"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { OutcomePopup } from "./components/Outcome";
import Loading from "./components/Loading";
import { useOutcomes } from "./utils/useOutcomes";
import { useCurrentDilemma } from "./utils/useCurrentDilemma";
import Viewport from "./components/Viewport";
import Dialog from "./components/Dialog";
import Stats from "./components/Stats";
import { AnimatePresence, motion } from "framer-motion";
import useBaseStats from "./utils/useBaseStats";
import Actions from "./components/Actions";
import HoverText from "@/components/HoverText";
import { useState } from "react";

export default function Play() {
  const [hoverText, setHoverText] = useState<string | null>(null);
  const stateResult = useQuery(api.state.getActiveGameState);
  const { baseStats, incrementStat } = useBaseStats(stateResult);
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
      <div className="flex flex-col items-center justify-center p-4 sm:p-0 sm:w-xl w-full">
        <HoverText hoverText={hoverText} />

        {/* Stats */}
        <motion.div
          key="stats"
          className="sm:absolute w-full h-full flex flex-col sm:items-end sm:p-4 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Stats
            pet={pet}
            baseStats={baseStats}
            seenDilemmasCount={seenDilemmas.length}
          />
        </motion.div>

        {/* Outcomes */}
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

        {/* Viewport & dilemma */}
        <div className="flex flex-col gap-4">
          <motion.div
            key="viewport"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-2"
          >
            <Viewport
              clarifyingQuestion={
                status === "has_unresolved_dilemma"
                  ? stateResult.question
                  : null
              }
            />
          </motion.div>

          {/* Actions */}
          <Actions setHoverText={setHoverText} incrementStat={incrementStat} />

          <motion.div
            key="dialog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col gap-4"
          >
            <Dialog
              pet={pet}
              dilemma={currentDilemma}
              onOutcome={addOutcome}
              onProcessingStart={onDilemmaProcessingStart}
              onProcessingEnd={onDilemmaProcessingEnd}
              disabled={isProcessing} // disable the button when processing
            />
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
