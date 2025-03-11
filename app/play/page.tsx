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
import { useState, useEffect, useCallback } from "react";
import { Animation } from "@/constants/sprites";
import { ObjectKey } from "@/constants/objects";
import { getEvolutionTimeFrame } from "@/constants/evolutions";
import { EvolutionId } from "@/constants/evolutions";
import { getEvolution } from "@/constants/evolutions";
import Window from "@/components/Window";
import Graduation from "./components/Graduation";
import Actions from "./components/Actions";
import AchievementsSidebar from "./components/AchievementsSidebar";
import { AchievementId } from "@/constants/achievements";

export default function Play() {
  const [animation, setAnimation] = useState<Animation>(Animation.IDLE);
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [cursorObject, setCursorObject] = useState<ObjectKey | null>(null);
  const [rip, setRip] = useState(false);
  const [dilemmaOpen, setDilemmaOpen] = useState(false);
  const [graduationOpen, setGraduationOpen] = useState(false);
  const { outcomes, addOutcome, removeOutcome } = useOutcomes();
  const { userAchievements } = useAchievements(addOutcome);
  const [stateLoadingTimeout, setStateLoadingTimeout] = useState(false);
  const [stateLoadError, setStateLoadError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  const MAX_AUTO_RETRIES = 3; // prevent infinite retry loops

  // State for tracking which achievements have been shown to the user
  const [shownAchievements, setShownAchievements] = useState<AchievementId[]>(
    []
  );

  // Track if we're using optimistic cached data
  const [isOptimistic, setIsOptimistic] = useState(false);

  // Use cached state for optimistic updates
  const { cachedState, isUsingCachedState } = useCachedState();

  // Load shown achievements from localStorage on mount
  useEffect(() => {
    const savedShownAchievements = localStorage.getItem("shown_achievements");
    if (savedShownAchievements) {
      setShownAchievements(JSON.parse(savedShownAchievements));
    }
  }, []);

  // Callback for when achievements are seen
  const handleAchievementsSeen = useCallback((ids: AchievementId[]) => {
    setShownAchievements((prev) => {
      const newShownAchievements = [...prev, ...ids];
      // Update localStorage
      localStorage.setItem(
        "shown_achievements",
        JSON.stringify(newShownAchievements)
      );
      return newShownAchievements;
    });
  }, []);

  // use the query with error handling and retry capabilities
  const stateQuery = useQuery(api.state.getActiveGameState);
  const stateResult = stateQuery;
  const stateError = stateQuery instanceof Error ? stateQuery : null;

  // Determine which state to use - real or optimistic
  // If stateResult is undefined (loading) but we have cached state, use cached state
  const displayState =
    stateResult !== undefined
      ? stateResult
      : isUsingCachedState && cachedState
        ? cachedState
        : undefined;

  // Track if we're using optimistic rendering
  useEffect(() => {
    // We're using optimistic data if we have cached state but no stateResult yet
    setIsOptimistic(stateResult === undefined && displayState !== undefined);

    // Cache the state when it loads from server
    if (stateResult !== undefined) {
      cacheGameState(stateResult);
    }
  }, [stateResult, displayState]);

  // Add a timeout for state loading with better error handling
  useEffect(() => {
    if (!isRetrying) {
      setStateLoadError(null);
    }

    if (displayState !== undefined && autoRetryCount > 0) {
      setAutoRetryCount(0);
    }

    let autoRetryTimeoutId: NodeJS.Timeout | undefined;
    if (displayState === undefined && !isRetrying) {
      const timeoutId = setTimeout(() => {
        console.log("state loading timeout reached");
        setStateLoadingTimeout(true);
      }, 15000); // 15 seconds timeout
      // quick timeout for auto retry
      if (autoRetryCount < MAX_AUTO_RETRIES) {
        autoRetryTimeoutId = setTimeout(() => {
          console.log(`auto retry attempt ${autoRetryCount + 1}`);
          setIsRetrying(true);
          setAutoRetryCount((prev) => prev + 1);
          // force a re-query
          setTimeout(() => {
            setIsRetrying(false);
          }, 500);
        }, 1000); // retry after 1 second
      }

      // clear timeouts if component unmounts or state loads
      return () => {
        clearTimeout(timeoutId);
        if (autoRetryTimeoutId) clearTimeout(autoRetryTimeoutId);
      };
    }

    // Handle any errors from the query
    if (stateError) {
      console.error("Error loading game state:", stateError);
      setStateLoadError(stateError.message || "Unknown error occurred");
      setStateLoadingTimeout(true);
    }

    // cleanup function
    return () => {
      if (autoRetryTimeoutId) clearTimeout(autoRetryTimeoutId);
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
  } = useCurrentDilemma({
    stateResult: displayState,
  });

  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    setStateLoadingTimeout(false);
    setStateLoadError(null);
    setTimeout(() => {
      setIsRetrying(false);
    }, 500);
  }, []);

  // Handle loading state with timeout fallback
  if (displayState === undefined) {
    // If we've hit the timeout or have an error, show a refresh button
    if (stateLoadingTimeout || stateLoadError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center mb-4">
            {stateLoadError
              ? `error loading your pet: ${stateLoadError}`
              : "taking too long to load... there might be a connection issue."}
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

  // Optimistic UI overlay - shows when using cached data
  const OptimisticIndicator = () => {
    if (isOptimistic) {
      return (
        <div className="fixed bottom-4 left-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
          using cached data...
        </div>
      );
    }
    return null;
  };

  const { status } = displayState;

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

  // extract pet and seenDilemmas based on status
  const { pet, seenDilemmas } = displayState;
  const evolution = getEvolution(pet.evolutionId as EvolutionId);
  const timeFrame = getEvolutionTimeFrame(pet.age);
  const hasGraduated = pet.age >= 2;

  // Handle unresolved dilemma question safely with type checking
  const clarifyingQuestion =
    status === "has_unresolved_dilemma" && "question" in displayState
      ? displayState.question
      : null;

  return (
    <>
      <HoverText hoverText={hoverText} cursorObject={cursorObject} />

      {/* Achievements Sidebar */}
      <AchievementsSidebar
        userAchievements={userAchievements}
        shownAchievements={shownAchievements}
        onAchievementsSeen={handleAchievementsSeen}
      />

      {/* Show optimistic data indicator */}
      <OptimisticIndicator />

      {/* Outcomes */}
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
              key="graduated-content"
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
              hasRip={rip}
            />
          </motion.div>

          {/* Viewport & dilemma */}
          <motion.div
            key="viewport"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Viewport
              pet={pet}
              hasGraduated={hasGraduated}
              cursorObject={cursorObject}
              poos={poos}
              cleanupPoo={cleanupPoo}
              incrementStat={(stat) => {
                incrementStat(stat);
                setCursorObject(null);
              }}
              rip={rip}
              animation={animation}
              clarifyingQuestion={clarifyingQuestion}
              baseStats={baseStats}
            />
          </motion.div>

          <div className="sm:absolute sm:bottom-0 sm:right-0 sm:p-4 w-full z-20 pointer-events-none">
            <MoralStats moralStats={pet.moralStats} />
          </div>

          {/* Main content */}
          {hasGraduated ? (
            <motion.div
              key="graduated"
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
                    🎓 collect graduation certificate
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
