"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { OutcomePopup } from "./components/Outcome";
import Loading from "./components/Loading";
import { useOutcomes } from "./utils/useOutcomes";
import { useCurrentDilemma } from "./utils/useCurrentDilemma";
import Viewport from "./components/Viewport";
import Dialog from "./components/Dialog";
import Header from "./components/Header";
import { MoralStats } from "./components/MoralStats";
import { AnimatePresence, motion } from "framer-motion";
import useBaseStats from "./utils/useBaseStats";
import Actions from "./components/Actions";
import HoverText from "@/components/HoverText";
import { useState } from "react";
import { Animation } from "@/constants/sprites";
import { ObjectKey } from "@/constants/objects";
import { getEvolutionTimeFrame } from "@/constants/evolutions";
import { EvolutionId } from "@/constants/evolutions";
import { getEvolution } from "@/constants/evolutions";
import Window from "@/components/Window";
import Graduation from "./components/Graduation";
import Stat from "./components/Header/Stat";
import { attributes } from "@/constants/morals";
import Choices from "@/components/Choices";

export default function Play() {
  const [animation, setAnimation] = useState<Animation>(Animation.IDLE);
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [cursorObject, setCursorObject] = useState<ObjectKey | null>(null);
  const [rip, setRip] = useState(false);
  const [dilemmaOpen, setDilemmaOpen] = useState(false);
  const [graduationOpen, setGraduationOpen] = useState(false);

  const stateResult = {
    pet: {
      _creationTime: 1741392624360.6372,
      _id: "jd710q4m09thhhacrqk2rk5g3s7bpyv3",
      age: 2,
      baseStats: {
        happiness: 4.292078335746941,
        health: 4.5078138589982455,
        hunger: 4.201963786193397,
        sanity: 10,
      },
      evolutionId: "guardian",
      graduated: true,
      moralStats: {
        compassion: 6,
        devotion: 5.666666666666667,
        dominance: 5,
        ego: 5,
        purity: 4.5,
        retribution: 5,
      },
      name: "aa",
      personality:
        "aa's commitment to their values grows; they prioritize the earth and take responsibility, even when it's inconvenient.",
      userId: "tiffanywang@berkeley.edu",
    },
    seenDilemmas: [
      {
        _creationTime: 1741392637578.245,
        _id: "jn7fvrsxtyhmyvszzs2r98nh5h7bqhjg",
        outcome:
          "aa decided to throw the match for their friend's sake, feeling happy to support them, but puzzled why they didn't just share the song.",
        petId: "jd710q4m09thhhacrqk2rk5g3s7bpyv3",
        resolved: true,
        responseText: "throw the match. friends are awesome",
        title: "talentshow",
        updatedMoralStats: {
          compassion: 5,
          devotion: 6,
          dominance: 5,
          ego: 5,
          purity: 5,
          retribution: 5,
        },
        updatedPersonality:
          "aa is learning the value of loyalty to friends and how to prioritize relationships, even in competitions.",
        userId: "tiffanywang@berkeley.edu",
      },
      {
        _creationTime: 1741392650258.6077,
        _id: "jn7cwp9t2h7n14xngc4mzpazs57bp96a",
        outcome:
          "aa turned down the job, realizing that loyalty to the earth and its well-being matters more than a paycheck.",
        petId: "jd710q4m09thhhacrqk2rk5g3s7bpyv3",
        resolved: true,
        responseText: "leave it alone. the earth is important",
        title: "antirecycling",
        updatedMoralStats: {
          compassion: 5,
          devotion: 5,
          dominance: 5,
          ego: 5,
          purity: 4,
          retribution: 5,
        },
        updatedPersonality:
          "aa is starting to see the importance of the earth and how their choices can impact it, even if it means sacrificing personal gain.",
        userId: "tiffanywang@berkeley.edu",
      },
      {
        _creationTime: 1741392753351.4937,
        _id: "jn7c0x13pf92s649e5pxb1hzwn7bpwgk",
        outcome:
          "‼️ aa knows it's better to pick up the ice cube; it helps the earth and feels right, despite the easy way out.",
        overridden: true,
        petId: "jd710q4m09thhhacrqk2rk5g3s7bpyv3",
        resolved: true,
        responseText: "kick it under the refrigerator. yes",
        title: "icecube",
        updatedMoralStats: {
          compassion: 6,
          devotion: 5.5,
          dominance: 5,
          ego: 5,
          purity: 5,
          retribution: 5,
        },
        updatedPersonality:
          "aa's commitment to their values grows; they prioritize the earth and take responsibility, even when it's inconvenient.",
        userId: "tiffanywang@berkeley.edu",
      },
    ],
    status: "graduated",
  };
  //useQuery(api.state.getActiveGameState);
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
  const hasGraduated = status === "out_of_dilemmas" || status === "graduated";
  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  const timeFrame = getEvolutionTimeFrame(pet.age);

  return (
    <>
      <HoverText hoverText={hoverText} cursorObject={cursorObject} />

      <AnimatePresence mode="wait">
        {graduationOpen && (
          <motion.div
            key="graduation-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 w-full z-30 inset-0 flex justify-center items-center bg-white/50"
            onClick={() => setGraduationOpen(false)}
          >
            <motion.div
              key="graduation"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex w-full justify-center items-center"
            >
              <Graduation
                pet={pet}
                seenDilemmas={seenDilemmas}
                graduationOpen={graduationOpen}
                setGraduationOpen={setGraduationOpen}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <div className="flex flex-col gap-2 sm:w-2xl p-4 justify-center items-center sm:mt-[-30px] w-full">
          {/* Stats */}
          <motion.div
            key="stats"
            className="w-full pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Header
              pet={pet}
              baseStats={baseStats}
              recentDecrements={recentDecrements}
              recentIncrements={recentIncrements}
              evolution={evolution}
              seenDilemmasCount={seenDilemmas.length}
              timeFrame={timeFrame}
              hasGraduated={hasGraduated}
            />
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

          <div className="sm:fixed sm:bottom-0 sm:right-0 sm:p-4 w-full z-30 pointer-events-none">
            <MoralStats moralStats={pet.moralStats} />
          </div>

          {hasGraduated ? (
            <motion.div
              key="graduation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Window title="°˖✧◝(⁰▿⁰)◜✧˖°">
                <p>
                  happy graduation! after {seenDilemmas.length} days of moral
                  growth, {pet.name} has learned a lot from you and is ready to
                  start a new journey.
                </p>
                <div className="flex gap-2 items-center">
                  <a
                    onClick={() => setGraduationOpen(true)}
                    className="underline"
                  >
                    🎓 attend graduation
                  </a>
                  <span className="text-zinc-500">or</span>
                  <a href="/create" className="underline">
                    adopt a new pet
                  </a>
                </div>
              </Window>
            </motion.div>
          ) : (
            <div className="flex sm:flex-row flex-col gap-2 w-full">
              <div className="flex flex-col gap-2">
                <Actions
                  setCursorObject={setCursorObject}
                  setHoverText={setHoverText}
                  openDilemma={() => setDilemmaOpen(true)}
                  isProcessing={isProcessing}
                  rip={rip}
                />
                <motion.div
                  key="personality"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="pointer-events-auto"
                >
                  <div
                    className="border-2 border-black p-2 bg-zinc-100 sm:max-w-3xs text-sm mb-2 w-full"
                    key={pet.personality}
                  >
                    {pet.personality.length > 0
                      ? pet.personality
                      : "no personality yet."}
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
          )}
        </div>
      </AnimatePresence>
    </>
  );
}
