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

  if (status === "out_of_dilemmas" || pet.graduated) {
    return (
      <div>
        {pet.name} has graduated!
        <p>{pet.personality}</p>
        <p>{JSON.stringify(pet.moralStats)}</p>
        <p>{JSON.stringify(pet.baseStats)}</p>
        <p className="max-h-40 overflow-y-auto">
          {JSON.stringify(seenDilemmas)}
        </p>
      </div>
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
            rip={rip}
          />

          <motion.div
            key="dialog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col gap-4"
          ></motion.div>
        </div>
        <div className="sm:absolute left-0 z-40 max-w-sm px-8">
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
        </div>
      </div>
    </AnimatePresence>
  );
}
