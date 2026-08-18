"use client";

import { useState, useEffect, useCallback } from "react";
import Loading from "./components/Loading";
import { usePet, useHoverText, useDilemma } from "../providers/PetProvider";
import Viewport from "./components/Viewport";
import Dialog from "./components/Dialog";
import Header from "./components/Header";
import ActionButtons from "./components/Header/ActionButtons";
import { AnimatePresence, motion } from "framer-motion";
import HoverText from "@/components/HoverText";
import Window from "@/components/Window";
import HealMinigame from "./components/Header/HealMinigame";
import FeedMinigame from "./components/Header/FeedMinigame";
import PlayMinigame from "./components/Header/PlayMinigame";
import Graduation from "./components/Graduation";
import { EvolutionId, getEvolutionTimeFrame } from "@/constants/evolutions";
import { getAverageMoralStats } from "@/app/api/dilemma/evolve";

type ActivePanel = "heal" | "feed" | "play" | "dialog" | null;

function Content({
  activePanel,
  onClose,
}: {
  activePanel: ActivePanel;
  onClose: () => void;
}) {
  const { pet } = usePet();
  if (!pet) return null;

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

  if (activePanel === "heal") return <HealMinigame onClose={onClose} />;
  if (activePanel === "feed") return <FeedMinigame onClose={onClose} />;
  if (activePanel === "play") return <PlayMinigame onClose={onClose} />;
  if (activePanel === "dialog") return <Dialog onClose={onClose} />;

  return null;
}

function useDebugRevert() {
  const { pet, updatePet } = usePet();

  return useCallback(() => {
    if (!pet) return;

    // find the index of the last resolved dilemma
    let lastIdx = -1;
    for (let i = pet.dilemmas.length - 1; i >= 0; i--) {
      if (pet.dilemmas[i].completed && pet.dilemmas[i].stats) { lastIdx = i; break; }
    }
    if (lastIdx === -1) return;

    const remaining = pet.dilemmas.filter((_, i) => i !== lastIdx);
    const resolved = remaining.filter((d) => d.completed && d.stats);
    const newMoralStats = getAverageMoralStats(resolved);

    // roll back evolution if that dilemma crossed a threshold
    let newAge = pet.age;
    let newEvolutionIds = pet.evolutionIds;
    if (pet.age >= 1 && resolved.length < getEvolutionTimeFrame(pet.age - 1)) {
      newAge = pet.age - 1;
      newEvolutionIds = pet.evolutionIds.slice(0, -1);
    }

    updatePet({ dilemmas: remaining, moralStats: newMoralStats, age: newAge, evolutionIds: newEvolutionIds });
  }, [pet, updatePet]);
}

export default function Play() {
  const [graduationOpen, setGraduationOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [debugVisible, setDebugVisible] = useState(false);
  const { pet, evolution } = usePet();
  const { hoverText } = useHoverText();
  const { dilemma } = useDilemma();
  const hasGraduated = pet?.age !== undefined && pet.age >= 3;
  const revertLastDilemma = useDebugRevert();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDebugVisible((v) => !v); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // auto-open dialog when a new dilemma arrives, close when it clears
  const dilemmaId = dilemma?.id;
  useEffect(() => {
    if (dilemmaId) setActivePanel("dialog");
    else setActivePanel((prev) => (prev === "dialog" ? null : prev));
  }, [dilemmaId]);

  if (!pet || !evolution) {
    return (
      <div className="flex flex-col gap-2 sm:w-3xl p-4 w-full mb-30">
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
        <div className="flex flex-col gap-2">
          <div className="relative flex flex-1 w-full md:w-[calc(100%-320px)] md:max-w-[740px]">
            <div className="flex flex-col gap-2 w-full h-full">
              <Viewport
                onHealClick={() => setActivePanel("heal")}
                onFeedClick={() => setActivePanel("feed")}
                onPlayClick={() => setActivePanel("play")}
                onTalkClick={() => setActivePanel("dialog")}
              />

              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-auto"
                >
                  <ActionButtons
                    onHealClick={() => setActivePanel("heal")}
                    onFeedClick={() => setActivePanel("feed")}
                    onPlayClick={() => setActivePanel("play")}
                    onTalkClick={() => setActivePanel("dialog")}
                  />
                </motion.div>

                {/* panels — absolutely positioned right below action buttons, float over header */}
                <AnimatePresence>
                  {hasGraduated && (
                    <motion.div
                      key="graduated"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-2"
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

                  {activePanel && (
                    <motion.div
                      key={activePanel}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="absolute mt-2 left-0 right-0 z-50 flex flex-col gap-2 w-full"
                    >
                      <Content
                        activePanel={activePanel}
                        onClose={() => setActivePanel(null)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right column: pet info + base stats + morality */}
          <motion.div
            className="md:absolute md:right-0 md:top-0 md:z-50 h-full md:bg-[var(--color-background)] md:border-l-2 md:p-5 md:w-80 md:ml-2 w-full flex flex-col gap-2 mt-2 md:mt-0 overflow-y-scroll"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div
              className={`transition-opacity duration-300 md:opacity-100 ${activePanel ? "opacity-30 pointer-events-none" : "opacity-100"}`}
            >
              <Header />
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {debugVisible && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 shadow-md">
          <span className="text-zinc-400 text-xs">debug</span>
          <button
            onClick={revertLastDilemma}
            className="border border-zinc-400 px-2 py-0.5 hover:bg-zinc-100 text-zinc-700"
          >
            ↩ revert last dilemma
          </button>
        </div>
      )}
    </div>
  );
}
