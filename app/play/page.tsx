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
import { getEvolutionTimeFrame } from "@/constants/evolutions";
import { EvolutionId } from "@/constants/evolutions";
import { getEvolution } from "@/constants/evolutions";

export default function Play() {
  const [animation, setAnimation] = useState<Animation>(Animation.IDLE);
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [cursorObject, setCursorObject] = useState<ObjectKey | null>(null);
  const [rip, setRip] = useState(false);
  const [dilemmaOpen, setDilemmaOpen] = useState(false);

  const stateResult = useQuery(api.state.getActiveGameState);
  const {
    baseStats,
    incrementStat,
    poos,
    cleanupPoo,
    recentDecrements,
    recentIncrements,
  } = useBaseStats({
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
  const isGraduated = status === "out_of_dilemmas" || status === "graduated";
  if (isGraduated) {
    return (
      <>
        <Graduation pet={pet} seenDilemmas={seenDilemmas} />
      </>
    );
  }

  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  const timeFrame = getEvolutionTimeFrame(pet.age);

  return (
    <>
      <HoverText hoverText={hoverText} cursorObject={cursorObject} />

      <AnimatePresence mode="wait">
        <div className="flex flex-col gap-2 items-center justify-center sm:w-2xl w-full py-[20%] sm:p-0 p-4">
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
              recentDecrements={recentDecrements}
              recentIncrements={recentIncrements}
            />
            <p className="flex items-center text-zinc-500">
              <b>level {pet.age}</b>—{evolution.id}
            </p>
            <p>
              {pet.age < 2
                ? `${seenDilemmas.length} / ${timeFrame} dilemmas til next evolution`
                : `${seenDilemmas.length} / ${timeFrame} dilemmas til graduation`}
            </p>
          </motion.div>

          {/* Outcomes */}
          <div className="fixed top-0 p-4 w-full max-w-lg z-30">
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
          <motion.div
            key="viewport"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex w-full justify-center items-center"
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
              baseStats={baseStats}
            />
          </motion.div>

          <div className="flex sm:flex-row flex-col w-full justify-between sm:p-0 gap-2">
            <div className="flex flex-col gap-2">
              <Actions
                setCursorObject={setCursorObject}
                setHoverText={setHoverText}
                openDilemma={() => setDilemmaOpen(true)}
                isProcessing={isProcessing}
                rip={rip}
              />
              <motion.div
                key="viewport"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="pointer-events-auto"
              >
                <div className="border-2 border-black p-2 bg-zinc-100 sm:max-w-3xs text-sm mb-2 w-full">
                  {pet.name} is {evolution.description}. {pet.personality}{" "}
                </div>
              </motion.div>
            </div>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="flex w-full"
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
            </AnimatePresence>
          </div>
        </div>
      </AnimatePresence>
    </>
  );
}
