import React from "react";
import Image from "next/image";
import { Background, VIEWPORT_WIDTH } from "@/components/Background";
import { VIEWPORT_HEIGHT } from "@/components/Background";
import { motion } from "framer-motion"; // import framer motion

const Viewport = React.memo(function Viewport({
  clarifyingQuestion,
}: {
  clarifyingQuestion: string | null;
}) {
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
          src="/birb_smol.gif"
          alt="birb"
          width={150}
          height={150}
          unoptimized
          className="mt-10"
        />
      </Background>
    </div>
  );
});

export default Viewport;
