import React, { useMemo } from "react";
import Image from "next/image";
import { Background, VIEWPORT_WIDTH } from "@/components/Background";
import { VIEWPORT_HEIGHT } from "@/components/Background";
import { motion } from "framer-motion"; // import framer motion
import { Animation, RIP_SPRITE, SPRITES } from "@/constants/sprites";
import { Doc } from "@/convex/_generated/dataModel";
import { BaseStatKeys, BaseStatsType, PooType } from "@/constants/base";
import { ObjectKey } from "@/constants/objects";

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
  const petSprite = useMemo(() => {
    if (rip) {
      return RIP_SPRITE;
    }
    return SPRITES[pet.age as keyof typeof SPRITES][animation];
  }, [rip, pet.age, animation]);

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
            className="absolute z-30 cursor-pointer hover:opacity-50 transition-opacity"
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
        <Image
          src={petSprite}
          alt="birb"
          width={VIEWPORT_WIDTH / 4.5}
          height={VIEWPORT_HEIGHT / 4.5}
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
          className="translate-y-[22%]"
        />
      </Background>
    </div>
  );
});

export default Viewport;
