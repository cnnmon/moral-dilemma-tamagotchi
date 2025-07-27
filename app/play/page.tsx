"use client";

import Outcome from "./components/Outcome";
import Loading from "./components/Loading";
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
import HealMinigame from "./components/Header/HealMinigame";
import PlayMinigame from "./components/Header/PlayMinigame";

function Content({
  hasGraduated,
  healMinigameOpen,
  playMinigameOpen,
  setGraduationOpen,
  setHealMinigameOpen,
  setPlayMinigameOpen,
}: {
  hasGraduated: boolean;
  healMinigameOpen: boolean;
  playMinigameOpen: boolean;
  setGraduationOpen: (open: boolean) => void;

  setHealMinigameOpen: (open: boolean) => void;
  setPlayMinigameOpen: (open: boolean) => void;
}) {
  const { pet } = usePet();
  if (!pet) {
    return null;
  }

  if (hasGraduated) {
    return (
      <motion.div
        key="graduated"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Window title="°˖✧◝(⁰▿⁰)◜✧˖°">
          <div className="flex flex-col gap-1 p-3">
            <p>
              happy graduation! after {pet.dilemmas.length} dilemmas,
              {pet.name} has learned a lot from you and is ready to start a new
              journey.
            </p>
            <a onClick={() => setGraduationOpen(true)} className="underline">
              🎓 collect graduation certificate
            </a>
            <a href="/scrapbook" className="underline">
              📷 check out scrapbook
            </a>
            <a href="/create" className="underline">
              adopt a new pet
            </a>
          </div>
        </Window>
      </motion.div>
    );
  }

  if (healMinigameOpen) {
    return (
      <HealMinigame isOpen={healMinigameOpen} setIsOpen={setHealMinigameOpen} />
    );
  }

  if (playMinigameOpen) {
    return (
      <PlayMinigame isOpen={playMinigameOpen} setIsOpen={setPlayMinigameOpen} />
    );
  }

  return <Dialog />;
}

export default function Play() {
  const [graduationOpen, setGraduationOpen] = useState(false);
  const [healMinigameOpen, setHealMinigameOpen] = useState(false);
  const [playMinigameOpen, setPlayMinigameOpen] = useState(false);
  const { pet, evolution } = usePet();
  const { hoverText } = useHoverText();

  // Loading state
  if (!pet || !evolution) {
    return <Loading />;
  }

  const hasGraduated = pet.age >= 2;
  return (
    <>
      <HoverText hoverText={hoverText} />

      {/* Outcome modal */}
      <Outcome />

      {/* graduation modal */}
      {graduationOpen && (
        <Graduation
          pet={pet}
          graduationOpen={graduationOpen}
          setGraduationOpen={setGraduationOpen}
        />
      )}

      <AnimatePresence mode="wait">
        <div className="flex flex-col gap-2 sm:w-3xl p-4 w-full mb-30">
          <Menu page="play" />

          {/* pet stats */}
          <motion.div
            key="stats"
            className="w-full pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Header
              onHealClick={() => setHealMinigameOpen(true)}
              onPlayClick={() => setPlayMinigameOpen(true)}
            />
          </motion.div>

          {/* main viewport */}
          <Viewport />

          {/* graduated or active pet ui */}
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
                <Content
                  hasGraduated={hasGraduated}
                  healMinigameOpen={healMinigameOpen}
                  playMinigameOpen={playMinigameOpen}
                  setGraduationOpen={setGraduationOpen}
                  setHealMinigameOpen={setHealMinigameOpen}
                  setPlayMinigameOpen={setPlayMinigameOpen}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </AnimatePresence>
    </>
  );
}
