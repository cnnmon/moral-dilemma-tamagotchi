"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Window from "@/components/Window";
import { AnimatePresence, motion } from "framer-motion";
import {
  EvolutionId,
  Stage1EvolutionId,
  stage1Evolutions,
} from "@/constants/evolutions";
import { Animation, getSprite } from "@/constants/sprites";
import { twMerge } from "tailwind-merge";

const stage1Order: Stage1EvolutionId[] = [
  EvolutionId.DEVOUT,
  EvolutionId.HEDONIST,
  EvolutionId.WATCHER,
  EvolutionId.EMPATH,
  EvolutionId.SOLDIER,
  EvolutionId.TEACHERSPET,
  EvolutionId.NPC,
];

function getUnlockedEvolutionId(evolutionId: string) {
  return evolutionId.split("_")[0] as EvolutionId;
}

function EvolutionNode({
  evolutionId,
  achieved,
}: {
  evolutionId: EvolutionId;
  achieved: boolean;
}) {
  const sprite = getSprite(Animation.HAPPY, evolutionId);
  const maskStyle: CSSProperties = {
    maskImage: `url(${sprite})`,
    WebkitMaskImage: `url(${sprite})`,
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskSize: "contain",
    WebkitMaskSize: "contain",
  };

  return (
    <div className="flex min-w-24 flex-col items-center">
      {achieved ? (
        <Image
          src={sprite}
          alt={evolutionId}
          width={64}
          height={64}
          className="h-16 w-16 object-contain"
        />
      ) : (
        <div
          aria-label={evolutionId}
          role="img"
          className="h-16 w-16 bg-black"
          style={maskStyle}
        />
      )}
      <p className={twMerge("text-center")}>
        {!achieved ? "???" : evolutionId}
      </p>
    </div>
  );
}

export default function EvolutionGraphModal({
  isOpen,
  evolutionSet,
  onClose,
}: {
  isOpen: boolean;
  evolutionSet: Set<EvolutionId>;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-500/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <Window title="evolution graph" setIsOpen={onClose}>
              <div className="overflow-x-auto bg-white p-4">
                <div className="min-w-[900px] space-y-3">
                  <div className="flex flex-col items-center">
                    <p>stage 0: naivete</p>
                    <EvolutionNode
                      evolutionId={EvolutionId.BABY}
                      achieved={evolutionSet.has(EvolutionId.BABY)}
                    />
                    <div className="h-6 border-l-2 border-zinc-800" />
                  </div>

                  <p className="text-center">stage 1: after 4 dilemmas</p>

                  <div className="relative h-8 px-10">
                    <div className="absolute left-10 right-10 top-0 border-t-2 border-zinc-800" />
                    <div className="grid h-full grid-cols-7 gap-3">
                      {stage1Order.map((evolutionId) => (
                        <div
                          key={evolutionId}
                          className="mx-auto h-full border-l-2 border-zinc-800"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-3 px-10">
                    {stage1Order.map((evolutionId) => (
                      <EvolutionNode
                        key={evolutionId}
                        evolutionId={evolutionId}
                        achieved={evolutionSet.has(evolutionId)}
                      />
                    ))}
                  </div>

                  <div className="grid h-8 grid-cols-7 gap-3 px-10">
                    {stage1Order.map((evolutionId) => (
                      <div
                        key={evolutionId}
                        className="mx-auto h-full border-l-2 border-zinc-800"
                      />
                    ))}
                  </div>

                  <p className="text-center">stage 2: after 7 dilemmas</p>

                  <div className="grid h-6 grid-cols-7 gap-3 px-10">
                      {stage1Order.map((evolutionId) => (
                        <div
                          key={evolutionId}
                          className="mx-auto h-full border-l-2 border-zinc-800"
                        />
                      ))}
                  </div>

                  <div className="grid grid-cols-7 gap-3 px-10">
                    {stage1Order.map((stage1EvolutionId) => (
                      <div
                        key={stage1EvolutionId}
                        className="flex flex-col items-center gap-2"
                      >
                        {Object.values(
                          stage1Evolutions[stage1EvolutionId].nextStages
                        ).map((stage2EvolutionId) => {
                          const evolutionId =
                            getUnlockedEvolutionId(stage2EvolutionId);

                          return (
                            <EvolutionNode
                              key={`${stage1EvolutionId}-${stage2EvolutionId}`}
                              evolutionId={evolutionId}
                              achieved={evolutionSet.has(evolutionId)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <p className="text-center">stage 3: graduation!</p>
                </div>
              </div>
            </Window>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
