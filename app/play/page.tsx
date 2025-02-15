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
import { Animation } from "@/constants/sprites";
import { ObjectKey } from "@/constants/objects";
import Graduation from "./components/Graduation";

export default function Play() {
  const [animation, setAnimation] = useState<Animation>(Animation.IDLE);
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [cursorObject, setCursorObject] = useState<ObjectKey | null>(null);
  const [rip, setRip] = useState(false);
  const [dilemmaOpen, setDilemmaOpen] = useState(false);

  const stateResult = useQuery(api.state.getActiveGameState);
  const { baseStats, incrementStat, poos, cleanupPoo } = useBaseStats({
    stateResult,
    setAnimation,
    setRip,
    rip,
  });
  const { outcomes, addOutcome, removeOutcome } = useOutcomes();
  const {
    currentDilemma,
    onDilemmaProcessingStart,
    onDilemmaProcessingEnd,
    isProcessing,
  } = useCurrentDilemma({
    stateResult,
  });

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
  const { pet, seenDilemmas } = stateResult;

  if (status === "out_of_dilemmas" || status === "graduated") {
    return (
      <>
        <p className="fixed top-0 left-0 text-sm text-zinc-500 p-4">
          <a href="/create">outside</a> &gt; home &gt; {pet.name}
        </p>
        <Graduation pet={pet} seenDilemmas={seenDilemmas} />
      </>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <div className="flex flex-col items-center justify-center p-4 pt-[15%] sm:p-0 sm:w-xl w-full">
        <HoverText hoverText={hoverText} cursorObject={cursorObject} />

        <p className="fixed top-0 left-0 text-sm text-zinc-500 p-4">
          <a href="/create">outside</a> &gt; home &gt; {pet.name}
        </p>

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
        <div className="fixed top-0 p-4 w-full max-w-lg z-10">
          <AnimatePresence>
            {outcomes.map((outcome) => (
              <motion.div
                key={outcome.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <OutcomePopup
                  message={outcome.text}
                  exitable={outcome.exitable}
                  onClose={() => removeOutcome(outcome.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Viewport & dilemma */}
        <div className="flex flex-col gap-4 w-full">
          <motion.div
            key="viewport"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Viewport
              pet={pet}
              cursorObject={cursorObject}
              poos={poos}
              cleanupPoo={cleanupPoo}
              incrementStat={(stat) => {
                incrementStat(stat);
                setCursorObject(null);
              }}
              rip={rip}
              animation={animation}
              clarifyingQuestion={
                status === "has_unresolved_dilemma"
                  ? stateResult.question
                  : null
              }
            />
          </motion.div>

          {/* Actions */}
          <Actions
            setCursorObject={setCursorObject}
            setHoverText={setHoverText}
            openDilemma={() => setDilemmaOpen(true)}
            isProcessing={isProcessing}
            rip={rip}
          />
        </div>
        <div className="pt-4 sm:p-0 sm:absolute sm:right-0 z-40 sm:max-w-sm sm:pr-8">
          <AnimatePresence>
            {dilemmaOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Dialog
                  isOpen={dilemmaOpen}
                  setIsOpen={setDilemmaOpen}
                  petName={pet.name}
                  baseStats={baseStats}
                  rip={rip}
                  dilemma={currentDilemma}
                  onOutcome={addOutcome}
                  onProcessingStart={onDilemmaProcessingStart}
                  onProcessingEnd={onDilemmaProcessingEnd}
                  disabled={isProcessing}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatePresence>
  );
}
