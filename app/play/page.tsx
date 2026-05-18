"use client";

import { useState } from "react";
import Loading from "./components/Loading";
import { usePet, useHoverText } from "../providers/PetProvider";
import Viewport from "./components/Viewport";
import Dialog from "./components/Dialog";
import Header from "./components/Header";
import ActionButtons from "./components/Header/ActionButtons";
import { AnimatePresence, motion } from "framer-motion";
import HoverText from "@/components/HoverText";
import Window from "@/components/Window";
import Menu from "@/components/Menu";
import HealMinigame from "./components/Header/HealMinigame";
import FeedMinigame from "./components/Header/FeedMinigame";
import PlayMinigame from "./components/Header/PlayMinigame";
import Graduation from "./components/Graduation";
import { EvolutionId } from "@/constants/evolutions";

function Content({
  healMinigameOpen,
  feedMinigameOpen,
  playMinigameOpen,
  setHealMinigameOpen,
  setFeedMinigameOpen,
  setPlayMinigameOpen,
}: {
  healMinigameOpen: boolean;
  feedMinigameOpen: boolean;
  playMinigameOpen: boolean;
  setHealMinigameOpen: (open: boolean) => void;
  setFeedMinigameOpen: (open: boolean) => void;
  setPlayMinigameOpen: (open: boolean) => void;
}) {
  const { pet } = usePet();
  if (!pet) {
    return null;
  }

  if (pet.evolutionIds.includes(EvolutionId.RIP)) {
    return (
      <div className="flex w-full h-full">
        <Window title={`${pet.name} has died :(`}>
          <div className="flex flex-col p-3">
            <p>maybe you should take better care of them next time...</p>
            <div className="flex flex-col">
              <a href="/create">adopt a new pet</a>
            </div>
          </div>
        </Window>
      </div>
    );
  }

  if (healMinigameOpen) {
    return (
      <HealMinigame isOpen={healMinigameOpen} setIsOpen={setHealMinigameOpen} />
    );
  }

  if (feedMinigameOpen) {
    return (
      <FeedMinigame isOpen={feedMinigameOpen} setIsOpen={setFeedMinigameOpen} />
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
  const [feedMinigameOpen, setFeedMinigameOpen] = useState(false);
  const [playMinigameOpen, setPlayMinigameOpen] = useState(false);
  const { pet, evolution } = usePet();
  const { hoverText } = useHoverText();
  const hasGraduated = pet?.age !== undefined && pet.age >= 2;

  if (!pet || !evolution) {
    return (
      <div className="flex flex-col gap-2 sm:w-3xl p-4 w-full mb-30">
        <Menu page="play" />
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div>
      <HoverText hoverText={hoverText} />

      {/* graduation modal */}
      {graduationOpen && (
        <Graduation
          pet={pet}
          graduationOpen={graduationOpen}
          setGraduationOpen={setGraduationOpen}
        />
      )}

      <AnimatePresence mode="wait">
        <div className="flex flex-col gap-2 p-4">
          <Menu page="play" />

          <div className="relative w-full md:w-2xl">
            {/* Left column: viewport + actions + dialog */}
            <div className="flex flex-col gap-2 w-full">
              <Viewport />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-auto"
              >
                <ActionButtons
                  onHealClick={() => setHealMinigameOpen(true)}
                  onFeedClick={() => setFeedMinigameOpen(true)}
                  onPlayClick={() => setPlayMinigameOpen(true)}
                />
              </motion.div>

              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="flex flex-col gap-2 w-full"
                >
                  {hasGraduated && (
                    <motion.div
                      key="graduated"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Window title="°˖✧◝(⁰▿⁰)◜✧˖°">
                        <div className="flex flex-col gap-1 p-3">
                          <p>
                            happy graduation! after {pet.dilemmas.length}{" "}
                            dilemmas, {pet.name} has learned a lot from you and
                            is ready to start a new journey.
                          </p>
                          <a
                            onClick={() => setGraduationOpen(true)}
                            className="underline"
                          >
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
                  )}
                  <Content
                    healMinigameOpen={healMinigameOpen}
                    feedMinigameOpen={feedMinigameOpen}
                    playMinigameOpen={playMinigameOpen}
                    setHealMinigameOpen={setHealMinigameOpen}
                    setFeedMinigameOpen={setFeedMinigameOpen}
                    setPlayMinigameOpen={setPlayMinigameOpen}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right column: pet info + base stats + morality */}
          <motion.div
            className="md:absolute md:right-0 md:top-0 z-[80] h-full bg-[var(--color-background)] md:border-l-2 p-5 md:w-80 md:ml-2 w-full flex flex-col gap-2 mt-2 md:mt-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Header />
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
}
