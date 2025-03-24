import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { Background, VIEWPORT_WIDTH } from "@/components/Background";
import { VIEWPORT_HEIGHT } from "@/components/Background";
import { AnimatePresence, motion } from "framer-motion";
import { Animation, RIP_SPRITE, getSprite } from "@/constants/sprites";
import { Doc } from "@/convex/_generated/dataModel";
import { BaseStatKeys, BaseStatsType, PooType } from "@/constants/base";
import { ObjectKey } from "@/constants/objects";
import { EvolutionId } from "@/constants/evolutions";

// local storage key for tracking if egg animation has been shown
const EGG_CRACK_SHOWN_KEY = "egg_crack_animation_shown";

function isSpriteTransformation(prevSprite: string, currentSprite: string) {
  // checks if first letter of sprite changed
  // this works due to naming convention (e.g. smol -> old)
  const prevFirstLetter = prevSprite
    .split("/")
    [prevSprite.split("/").length - 1].charAt(0);
  const currentFirstLetter = currentSprite
    .split("/")
    [currentSprite.split("/").length - 1].charAt(0);
  return prevFirstLetter !== currentFirstLetter;
}

const Viewport = React.memo(function Viewport({
  pet,
  clarifyingQuestion,
  cursorObject,
  animation,
  rip,
  poos,
  cleanupPoo,
  incrementStat,
  baseStats,
  hasGraduated,
}: {
  pet: Doc<"pets">;
  clarifyingQuestion: string | null;
  cursorObject: ObjectKey | null;
  animation: Animation;
  rip: boolean;
  poos: PooType[];
  cleanupPoo: (id: number) => void;
  incrementStat: (stat: keyof BaseStatsType) => void;
  baseStats: BaseStatsType;
  hasGraduated: boolean;
}) {
  const [prevSprite, setPrevSprite] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isAlmostDead, setIsAlmostDead] = useState(false);
  const [showEggCrack, setShowEggCrack] = useState(false);

  // egg crack animation should be shown on first render
  useEffect(() => {
    const eggCrackShown = localStorage.getItem(EGG_CRACK_SHOWN_KEY);

    if (!eggCrackShown) {
      setShowEggCrack(true);
      const timer = setTimeout(() => {
        setShowEggCrack(false);
        localStorage.setItem(EGG_CRACK_SHOWN_KEY, "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const petSprite = useMemo(() => {
    if (rip) {
      return RIP_SPRITE;
    }
    const sprite = getSprite(
      pet.age,
      animation,
      pet.evolutionId as EvolutionId
    );
    if (!sprite) {
      throw new Error(
        `no sprite found for ${pet.age}, ${animation}, ${pet.evolutionId}`
      );
    }
    return sprite;
  }, [rip, pet.age, animation, pet.evolutionId]);

  // trigger transformation only if first letter changed
  useEffect(() => {
    if (prevSprite && prevSprite !== petSprite) {
      if (isSpriteTransformation(prevSprite, petSprite)) {
        setIsTransforming(true);
        const timer = setTimeout(() => {
          setIsTransforming(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
    setPrevSprite(petSprite);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petSprite]);

  // add transparency effect when stats are low
  useEffect(() => {
    // shake when any stat is low
    // but not entirely 0
    setIsAlmostDead(
      (baseStats.hunger < 2 && baseStats.hunger > 0) ||
        (baseStats.health < 2 && baseStats.health > 0) ||
        (baseStats.happiness < 2 && baseStats.happiness > 0) ||
        (baseStats.sanity < 2 && baseStats.sanity > 0)
    );
  }, [baseStats]);

  // undo effects when graduated
  useEffect(() => {
    if (hasGraduated) {
      setIsAlmostDead(false);
    }
  }, [hasGraduated]);

  return (
    <div
      style={{
        maxWidth: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
      }}
      className="flex items-center justify-center"
    >
      {poos.map(({ id, x, y }) => {
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
            />
          </div>
        );
      })}
      {!rip && clarifyingQuestion && (
        <motion.div
          key="clarifying-question"
          className="absolute w-xs bg-zinc-100 z-10 border border-2 p-2 mt-[-80px] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-sm">{clarifyingQuestion}</p>
        </motion.div>
      )}
      <Background hasOverlay backgroundSrcs={["/background.png", "/trees.gif"]}>
        <div className="relative">
          <div className="relative">
            <AnimatePresence>
              {showEggCrack && (
                <motion.div
                  className="absolute top-13 left-[-3px] w-full h-full z-10 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Image
                    src="/egg_crack.gif"
                    alt="egg cracking"
                    width={VIEWPORT_WIDTH / 3}
                    height={VIEWPORT_HEIGHT / 3}
                    className="absolute z-10"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Image
                src={petSprite}
                alt="birb"
                width={VIEWPORT_WIDTH / 5}
                height={VIEWPORT_HEIGHT / 5}
                onMouseEnter={() => {
                  if (cursorObject === "burger") {
                    incrementStat(BaseStatKeys.hunger);
                  } else if (cursorObject === "bandaid") {
                    incrementStat(BaseStatKeys.health);
                  } else if (cursorObject === "ball") {
                    incrementStat(BaseStatKeys.happiness);
                  }
                }}
                priority
                className={`translate-y-[30%] cursor-grab no-select ${
                  isAlmostDead ? "animate-pulse" : ""
                }`}
              />
            </motion.div>
          </div>

          {/* sparkles that appear during transformation */}
          {isTransforming && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                    left: "50%",
                    top: "50%",
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 0,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 150,
                    y: (Math.random() - 0.5) * 150,
                    opacity: 1,
                    scale: [0, 1, 0.5, 0],
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 1 + Math.random() * 0.5,
                    delay: Math.random() * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </div>
      </Background>
    </div>
  );
});

export default Viewport;
