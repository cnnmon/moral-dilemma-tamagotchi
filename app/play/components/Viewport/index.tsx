import React, { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Background, VIEWPORT_WIDTH } from "@/components/Background";
import { VIEWPORT_HEIGHT } from "@/components/Background";
import { AnimatePresence, motion } from "framer-motion";
import { RIP_SPRITE, getSprite } from "@/constants/sprites";
import { useBaseStats, useDilemma, usePet } from "@/app/providers/PetProvider";
import { EvolutionId } from "@/constants/evolutions";
import { Question } from "./Question";

// local storage key for tracking if egg animation has been shown
export const EGG_CRACK_SHOWN_KEY = "egg_crack_animation_shown";

const Viewport = React.memo(function Viewport() {
  const { pet, animation } = usePet();
  const { dilemma } = useDilemma();
  const { baseStats, poos, cleanupPoo } = useBaseStats();
  const [isAlmostDead, setIsAlmostDead] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const prevStatsRef = useRef(baseStats);

  // Initialize showEggCrack based on localStorage to avoid timing issues
  const [showEggCrack, setShowEggCrack] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem(EGG_CRACK_SHOWN_KEY);
    }
    return false;
  });

  // egg crack animation should be shown on first render
  useEffect(() => {
    if (showEggCrack) {
      const timer = setTimeout(() => {
        setShowEggCrack(false);
        localStorage.setItem(EGG_CRACK_SHOWN_KEY, "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showEggCrack]);

  const petSprite = useMemo(() => {
    if (!pet) {
      return null;
    }
    if (pet.evolutionIds.includes(EvolutionId.RIP)) {
      return RIP_SPRITE;
    }
    const sprite = getSprite(
      animation,
      pet.evolutionIds[pet.evolutionIds.length - 1]
    );
    if (!sprite) {
      throw new Error(
        `no sprite found for ${pet.age}, ${animation}, ${pet.evolutionIds[0]}`
      );
    }
    return sprite;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation, pet?.evolutionIds]);

  // Debounce stat changes to reduce re-renders
  useEffect(() => {
    // Only update if stats actually changed significantly
    const hasSignificantChange = Object.keys(baseStats).some((key) => {
      const statKey = key as keyof typeof baseStats;
      return Math.abs(baseStats[statKey] - prevStatsRef.current[statKey]) > 0.5;
    });

    if (hasSignificantChange) {
      const timer = setTimeout(() => {
        setIsAlmostDead(
          (baseStats.hunger < 2 && baseStats.hunger > 0) ||
            (baseStats.health < 2 && baseStats.health > 0) ||
            (baseStats.happiness < 2 && baseStats.happiness > 0) ||
            (baseStats.sanity < 2 && baseStats.sanity > 0)
        );
        prevStatsRef.current = baseStats;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [baseStats]);

  // undo effects when graduated
  useEffect(() => {
    if (pet?.age && pet.age >= 2) {
      setIsAlmostDead(false);
    }
  }, [pet?.age]);

  // Preload critical images
  useEffect(() => {
    if (petSprite) {
      const img = new window.Image();
      img.onload = () => setImagesLoaded(true);
      img.src = petSprite;
    }
  }, [petSprite]);

  return (
    <div
      style={{
        maxWidth: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
      }}
      className="flex items-center justify-center no-drag w-full"
    >
      {/* Lazy load poos after main content */}
      {imagesLoaded &&
        poos.map(({ id, x, y }) => {
          const left = x;
          const top = y + 10;
          return (
            <div
              key={id}
              className="absolute z-20 cursor-pointer hover:opacity-50 transition-opacity"
              style={{
                transform: `translate(${left}px, ${top}px)`,
              }}
              onClick={() => cleanupPoo(id)}
            >
              <Image
                src="/poo.gif"
                width={VIEWPORT_WIDTH / 15}
                height={VIEWPORT_HEIGHT / 15}
                className="visual"
                alt="poo"
                loading="lazy"
              />
            </div>
          );
        })}

      {dilemma && <Question dilemma={dilemma} />}

      <Background
        hasOverlay
        isAlmostDead={isAlmostDead}
        backgroundSrcs={["/background.png", "/trees.gif"]}
      >
        <div className="relative">
          <div className="relative">
            <AnimatePresence mode="wait">
              {showEggCrack && (
                <motion.div
                  className="absolute top-[63px] left-[-20px] w-[180px] h-[150px] z-10 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Image
                    src="/egg_crack.gif"
                    alt="egg cracking"
                    width={VIEWPORT_WIDTH / 5}
                    height={VIEWPORT_HEIGHT / 5}
                    className="absolute z-10 w-full h-full"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              key={`bird-${showEggCrack}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: showEggCrack ? 1.4 : 0.1 }}
            >
              {petSprite && (
                <Image
                  src={petSprite}
                  alt="birb"
                  width={VIEWPORT_WIDTH / 5}
                  height={VIEWPORT_HEIGHT / 5}
                  priority
                  className="translate-y-[30%] cursor-grab no-select"
                />
              )}
            </motion.div>
          </div>
        </div>
      </Background>
    </div>
  );
});

export default Viewport;
