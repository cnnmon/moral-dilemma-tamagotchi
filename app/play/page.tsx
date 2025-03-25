"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { OutcomePopup } from "./components/Outcome";
import Loading from "./components/Loading";
import {
  useOutcomes,
  useAchievements,
  useCurrentDilemma,
  useBaseStats,
  useCachedState,
  cacheGameState,
} from "./utils";
import Viewport from "./components/Viewport";
import Dialog from "./components/Dialog";
import Header from "./components/Header";
import { MoralStats } from "./components/MoralStats";
import { AnimatePresence, motion } from "framer-motion";
import HoverText from "@/components/HoverText";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Animation } from "@/constants/sprites";
import { getEvolutionTimeFrame, getEvolution } from "@/constants/evolutions";
import { EvolutionId } from "@/constants/evolutions";
import Window from "@/components/Window";
import Graduation from "./components/Graduation";
import Actions from "./components/Actions";
import AchievementsSidebar from "./components/AchievementsSidebar";
import { AchievementId } from "@/constants/achievements";
import { BaseStatKeys } from "@/constants/base";
import Menu from "@/components/Menu";

export default function Play() {
  // core state
  const [animation, setAnimation] = useState<Animation>(Animation.IDLE);
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [rip, setRip] = useState(false);
  const [dilemmaOpen, setDilemmaOpen] = useState(false);
  const [graduationOpen, setGraduationOpen] = useState(false);

  // loading and error state
  const [stateLoadingTimeout, setStateLoadingTimeout] = useState(false);
  const [stateLoadError, setStateLoadError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  const MAX_AUTO_RETRIES = 3;

  const { outcomes, addOutcome, removeOutcome } = useOutcomes();
  const { userAchievements } = useAchievements(addOutcome);
  const { cachedState, isUsingCachedState } = useCachedState();

  // achievement tracking
  const [shownAchievements, setShownAchievements] = useState<AchievementId[]>(
    []
  );

  useEffect(() => {
    const savedAchievements = localStorage.getItem("shown_achievements");
    if (savedAchievements) {
      setShownAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  const handleAchievementsSeen = useCallback((ids: AchievementId[]) => {
    setShownAchievements((prev) => {
      const newShown = [...prev, ...ids];
      localStorage.setItem("shown_achievements", JSON.stringify(newShown));
      return newShown;
    });
  }, []);

  // fetch game state
  const stateQuery = useQuery(api.state.getActiveGameState);
  const stateError = stateQuery instanceof Error ? stateQuery : null;

  // use cached state during loading if available
  const displayState = useMemo(
    () =>
      stateQuery !== undefined
        ? stateQuery
        : isUsingCachedState && cachedState
          ? cachedState
          : undefined,
    [stateQuery, isUsingCachedState, cachedState]
  );

  // cache state for future use
  useEffect(() => {
    if (stateQuery !== undefined) {
      cacheGameState(stateQuery);
    }
  }, [stateQuery]);

  // handle loading timeouts and retries
  useEffect(() => {
    if (!isRetrying) setStateLoadError(null);
    if (displayState !== undefined && autoRetryCount > 0) setAutoRetryCount(0);

    let timeoutId: NodeJS.Timeout;
    let retryTimeoutId: NodeJS.Timeout;

    if (displayState === undefined && !isRetrying) {
      // set timeout for showing error UI
      timeoutId = setTimeout(() => {
        setStateLoadingTimeout(true);
      }, 15000);

      // auto retry logic
      if (autoRetryCount < MAX_AUTO_RETRIES) {
        retryTimeoutId = setTimeout(() => {
          setIsRetrying(true);
          setAutoRetryCount((prev) => prev + 1);

          setTimeout(() => setIsRetrying(false), 500);
        }, 3000);
      }
    }

    // handle query errors
    if (stateError) {
      console.error("game state error:", stateError);
      setStateLoadError(stateError.message || "Unknown error");
      setStateLoadingTimeout(true);
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(retryTimeoutId);
    };
  }, [displayState, stateError, isRetrying, autoRetryCount]);

  const {
    baseStats,
    incrementStat,
    poos,
    cleanupPoo,
    recentDecrements,
    recentIncrements,
  } = useBaseStats({
    stateResult: displayState,
    setAnimation,
    setRip,
    rip,
  });

  const {
    currentDilemma,
    onDilemmaProcessingStart,
    onDilemmaProcessingEnd,
    isProcessing,
  } = useCurrentDilemma({ stateResult: displayState });

  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    setStateLoadingTimeout(false);
    setStateLoadError(null);
    setTimeout(() => setIsRetrying(false), 500);
  }, []);

  // create handlers before any early returns
  const handleIncrementStat = useCallback(
    (stat: BaseStatKeys) => {
      incrementStat(stat);
    },
    [incrementStat]
  );

  // handle loading and error states
  if (displayState === undefined) {
    if (stateLoadingTimeout || stateLoadError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center mb-4">
            {stateLoadError
              ? `error loading your pet: ${stateLoadError}`
              : "taking too long to load... connection issue?"}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              disabled={isRetrying}
            >
              {isRetrying ? "retrying..." : "retry"}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              refresh page
            </button>
          </div>
          <div className="text-center mt-4 text-sm text-gray-500">
            if this keeps happening, please try clearing your browser cache.
          </div>
        </div>
      );
    }
    return <Loading autoRetryCount={autoRetryCount} isRetrying={isRetrying} />;
  }

  const { status } = displayState;

  // redirect if not authenticated or no pet
  if (status === "not_authenticated") {
    window.location.href = "/";
    return <Loading />;
  }

  if (status === "needs_pet") {
    window.location.href = "/create";
    return <Loading />;
  }

  // extract pet data
  const { pet, seenDilemmas } = displayState;
  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  const timeFrame = getEvolutionTimeFrame(pet.age);
  const hasGraduated = status === "graduated";

  // get dilemma question if available
  const clarifyingQuestion =
    status === "has_unresolved_dilemma" && "question" in displayState
      ? displayState.question
      : null;

  return (
    <>
      {!hasGraduated && <HoverText hoverText={hoverText} />}
      <AchievementsSidebar
        userAchievements={userAchievements}
        shownAchievements={shownAchievements}
        onAchievementsSeen={handleAchievementsSeen}
      />

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
          pet={pet}
          graduationOpen={graduationOpen}
          setGraduationOpen={setGraduationOpen}
        />
      )}

      <AnimatePresence mode="wait">
        <div className="flex flex-col gap-2 sm:w-2xl p-4 justify-center items-center sm:mt-[-30px] w-full">
          <Menu page="play" currentPetName={pet.name} />

          {/* pet stats */}
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
              hasRip={rip}
            />
          </motion.div>

          {/* main viewport */}
          <motion.div
            key="viewport"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Viewport
              pet={pet}
              hasGraduated={hasGraduated}
              poos={poos}
              cleanupPoo={cleanupPoo}
              rip={rip}
              animation={animation}
              clarifyingQuestion={clarifyingQuestion}
              baseStats={baseStats}
            />
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
                    happy graduation! after {seenDilemmas.length} days of moral
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
              <div className="flex flex-col gap-2">
                <Actions
                  setHoverText={setHoverText}
                  openDilemma={() => setDilemmaOpen(true)}
                  isProcessing={isProcessing}
                  rip={rip}
                  baseStats={baseStats}
                  handleIncrementStat={handleIncrementStat}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="border-2 border-black p-2 bg-zinc-100 sm:max-w-3xs text-sm mb-2 w-full">
                    <MoralStats moralStats={pet.moralStats} />
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
