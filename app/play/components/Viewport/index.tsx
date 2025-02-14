import React, { useMemo } from "react";
import Image from "next/image";
import { Background, VIEWPORT_WIDTH } from "@/components/Background";
import { VIEWPORT_HEIGHT } from "@/components/Background";
import { motion } from "framer-motion"; // import framer motion
import { Animation, RIP_SPRITE, SPRITES } from "@/constants/sprites";
import { Doc } from "@/convex/_generated/dataModel";

const Viewport = React.memo(function Viewport({
  pet,
  clarifyingQuestion,
  animation,
  rip,
}: {
  pet: Doc<"pets">;
  clarifyingQuestion: string | null;
  animation: Animation;
  rip: boolean;
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
        width: "100%",
        maxWidth: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
        zIndex: -5,
      }}
      className="flex items-center justify-center"
    >
      {clarifyingQuestion && (
        <motion.div
          key="clarifying-question"
          className="absolute w-xs bg-zinc-100 z-10 border border-2 p-2 mt-[-80px] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm">{clarifyingQuestion}</p>
        </motion.div>
      )}
      <Background backgroundSrcs={["/background.png", "/trees.gif"]}>
        <Image
          src={petSprite}
          alt="birb"
          width={125}
          height={125}
          priority
          className="translate-y-[22%]"
        />
      </Background>
    </div>
  );
});

export default Viewport;
