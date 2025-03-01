import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { Background, VIEWPORT_WIDTH } from "@/components/Background";
import { VIEWPORT_HEIGHT } from "@/components/Background";
import { motion, AnimatePresence } from "framer-motion"; // import animatepresence
import { Animation, RIP_SPRITE, SPRITES } from "@/constants/sprites";
import { Doc } from "@/convex/_generated/dataModel";
import { BaseStatKeys, BaseStatsType, PooType } from "@/constants/base";
import { ObjectKey } from "@/constants/objects";

function isSpriteTransformation(prevSprite: string, currentSprite: string) {
  // checks if first letter of sprite changed
  // this works due to naming convention (e.g. smol -> old)
  const prevFirstLetter = prevSprite.split("/").pop()?.charAt(0);
  const currentFirstLetter = currentSprite.split("/").pop()?.charAt(0);
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
}: {
  pet: Doc<"pets">;
  clarifyingQuestion: string | null;
  cursorObject: ObjectKey | null;
  animation: Animation;
  rip: boolean;
  poos: PooType[];
  cleanupPoo: (id: number) => void;
  incrementStat: (stat: keyof BaseStatsType) => void;
}) {
  const [prevSprite, setPrevSprite] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const petSprite = useMemo(() => {
    if (rip) {
      return RIP_SPRITE;
    }
    return SPRITES[pet.age as keyof typeof SPRITES][animation];
  }, [rip, pet.age, animation]);

  // trigger transformation only if first letter changed
  useEffect(() => {
    setPrevSprite(petSprite);
  }, [petSprite]);

  useEffect(() => {
    if (prevSprite && prevSprite !== petSprite) {
      if (isSpriteTransformation(prevSprite, petSprite)) {
        setIsTransforming(true);
        // reset transformation after animation completes
        const timer = setTimeout(() => {
          setIsTransforming(false);
        }, 1500); // total animation duration
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petSprite]);

  // add shake effect when stats are low
  useEffect(() => {
    // shake when hunger is low
    if (pet.baseStats?.hunger < 2 && !isShaking) {
      setIsShaking(true);
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pet.baseStats?.hunger, isShaking]);

  return (
    <div
      style={{
        width: VIEWPORT_WIDTH,
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
            className="absolute z-10 cursor-pointer hover:opacity-50 transition-opacity"
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
      {clarifyingQuestion && (
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
          {/* pet sprite */}
          <AnimatePresence mode="wait">
            <motion.div
              key={petSprite}
              className="relative"
              initial={{
                filter: isTransforming
                  ? "contrast(0%) brightness(1000%)"
                  : "contrast(100%)",
              }}
              animate={{
                filter: "contrast(100%)",
                x: isShaking ? [0, -10, 10, -10, 10, 0] : 0,
              }}
              exit={{
                filter: isTransforming
                  ? "contrast(0%) brightness(1000%)"
                  : "contrast(100%)",
              }}
              transition={{
                duration: isShaking ? 0.5 : 0.5,
                ease: isShaking ? "easeInOut" : "easeOut",
                times: isShaking ? [0, 0.2, 0.4, 0.6, 0.8, 1] : undefined,
              }}
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
                className="translate-y-[30%]"
              />
            </motion.div>
          </AnimatePresence>

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
