"use client";

import { OutcomePopup } from "./components/Outcome";
import Loading from "./components/Loading";
import { useOutcomes } from "./utils";
import { usePet, useHoverText } from "../providers/PetProvider";
import Viewport from "./components/Viewport";
import Dialog from "./components/Dialog";
import Header from "./components/Header";
import { MoralStats } from "./components/MoralStats";
import { AnimatePresence, motion } from "framer-motion";
import HoverText from "@/components/HoverText";
import { useState } from "react";
import Window from "@/components/Window";
import Graduation from "./components/Graduation";
import Menu from "@/components/Menu";

export default function Play() {
  const [graduationOpen, setGraduationOpen] = useState(false);
  const { outcomes, removeOutcome } = useOutcomes();
  const { pet, evolution } = usePet();
  const { hoverText } = useHoverText();

  // Loading state
  if (!pet || !evolution) {
    return <Loading />;
  }

  const hasGraduated = pet.age >= 2;
  return (
    <>
      {!hasGraduated && <HoverText hoverText={hoverText} />}

      {/* outcome notifications */}
      <div className="fixed top-0 p-4 w-full max-w-lg z-30">
        <AnimatePresence>
          {outcomes.map((outcome, index) => (
            <motion.div
              key={index}
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

      {/* graduation modal */}
      {graduationOpen && (
        <Graduation
          graduationOpen={graduationOpen}
          setGraduationOpen={setGraduationOpen}
        />
      )}

      <AnimatePresence mode="wait">
        <div className="flex flex-col gap-2 sm:w-2xl p-4 justify-center items-center sm:mt-[-30px] w-full">
          <Menu page="play" />

          {/* pet stats */}
          <motion.div
            key="stats"
            className="w-full pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Header />
          </motion.div>

          {/* main viewport */}
          <motion.div
            key="viewport"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <Viewport />
          </motion.div>

          {/* graduated or active pet ui */}
          {hasGraduated ? (
            <motion.div
              key="graduated"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Window title="°˖✧◝(⁰▿⁰)◜✧˖°">
                <div className="flex flex-col gap-1">
                  <p>
                    happy graduation! after {pet.dilemmas.length} days of moral
                    growth, {pet.name} has learned a lot from you and is ready
                    to start a new journey.
                  </p>
                  <a
                    onClick={() => setGraduationOpen(true)}
                    className="underline"
                  >
                    🎓 collect graduation certificate
                  </a>
                  <a href="/scrapbook" className="underline">
                    check out scrapbook
                  </a>
                  <a href="/create" className="underline">
                    adopt a new pet
                  </a>
                </div>
              </Window>
            </motion.div>
          ) : (
            <div className="flex sm:flex-row flex-col gap-2 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:max-w-3xs"
              >
                <div className="border-2 border-black p-2 bg-zinc-100 mb-2 w-full">
                  <MoralStats moralStats={pet.moralStats} />
                </div>
              </motion.div>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex w-full"
                >
                  <Dialog />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </AnimatePresence>
    </>
  );
}
