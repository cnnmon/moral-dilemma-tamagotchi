import { getEvolutions, Stage2EvolutionId } from "@/constants/evolutions";
import { dilemmaTemplates } from "@/constants/dilemmas";
import { Doc } from "@/convex/_generated/dataModel";
import {
  attributes,
  MoralDimensions,
  getMoralStatsWritten,
} from "@/constants/morals";
import Image from "next/image";
import { SPRITES } from "@/constants/sprites";
import { Background } from "@/components/Background";
import Window from "@/components/Window";
import Choices from "@/components/Choices";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Graduation({
  pet,
  seenDilemmas,
}: {
  pet: Doc<"pets">;
  seenDilemmas: Doc<"dilemmas">[];
}) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const evolutions = getEvolutions(pet.evolutionId as Stage2EvolutionId);
  const sprite = SPRITES[pet.age as keyof typeof SPRITES]["idle"] as string;

  return (
    <div className="w-full md:w-xl my-[20%] flex flex-col justify-center gap-8 p-2">
      <Background backgroundSrcs={["/landscape.png"]}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={sprite}
            alt="graduation"
            width={140}
            height={140}
            className={`${selectedChoice === 0 ? "animate-bounce" : ""}`}
          />
        </motion.div>
      </Background>
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-gray-600 italic">after {pet.age} days...</p>
        <h3 className="text-4xl font-bold mt-2">{pet.name} has graduated!</h3>
        <p className="text-gray-600 italic">
          this is how their friends would describe them:
        </p>
        <p>{pet.personality}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Window title="survey">
          <Choices
            dilemmaText="were you a good parent?"
            choices={[{ text: "yes" }, { text: "no" }]}
            handleSubmit={() => {}}
            selectedChoice={selectedChoice}
            setSelectedChoice={(choice) => setSelectedChoice(choice)}
            showTextbox={false}
          />
          <p className="italic mt-4">
            {selectedChoice !== null ? (
              selectedChoice === 0 ? (
                <span>yippee!</span>
              ) : (
                <span>its ok we all make mistakes</span>
              )
            ) : null}
          </p>
        </Window>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Window title={`evolutions`}>
          <div className="space-y-6 text-left">
            {evolutions.map((evolution, index) => {
              const stage = 3 - index;
              const isFinal = stage === 3;
              return (
                <div key={evolution.id} className="text-gray-800">
                  <span className="text-sm uppercase tracking-wider text-gray-500">
                    stage {stage} {isFinal && "(final)"}
                  </span>

                  <div className="mt-1">
                    <b className="text-indigo-600">{evolution.id}</b>
                    {evolution.statUsed && (
                      <span>
                        {" "}
                        because you made choices that were highly{" "}
                        {evolution.statUsed.name}
                      </span>
                    )}
                  </div>

                  <p className="mt-1">{evolution.description}</p>
                </div>
              );
            })}
          </div>
        </Window>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Window title="morality">
          <div className="flex flex-col gap-4 w-full">
            {Object.entries(pet.moralStats).map(([key, value], index) => {
              const dimension = key as MoralDimensions;
              const trait = attributes[dimension];
              const percentage = (value - 5) * 20;
              const name =
                value === 5
                  ? `neutral on ${dimension}`
                  : `${Math.abs(Math.round(percentage))}% more ${attributes[dimension][value > 5 ? "high" : "low"]}`;

              return (
                <div key={key} className="flex gap-2 items-end text-right">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1 + 0.5,
                    }}
                    className="text-sm italic text-zinc-500 w-60 text-left"
                  >
                    {name}
                  </motion.p>
                  <div className="w-full">
                    <p className="text-sm uppercase tracking-wider text-gray-500">
                      {dimension}
                    </p>

                    <div className="flex justify-between text-sm">
                      <span>{trait.low}</span>
                      <span>{trait.high}</span>
                    </div>

                    <div className="flex items-center w-full justify-between gap-2">
                      <div className="w-full h-3 border flex bg-zinc-200">
                        <div className="absolute w-[2px] h-full bg-foreground left-1/2 -translate-x-1/2" />
                        <motion.div
                          initial={{
                            width: 0,
                            marginLeft: "50%",
                            marginRight: "50%",
                          }}
                          whileInView={{
                            width: `${Math.abs(percentage)}%`,
                            marginLeft:
                              percentage < 0
                                ? `calc(${50 - Math.abs(percentage)}%)`
                                : "50%",
                            marginRight:
                              percentage < 0
                                ? "50%"
                                : `calc(${50 - Math.abs(percentage)}%)`,
                          }}
                          transition={{
                            duration: 0.8,
                            delay: index * 0.1,
                            ease: "easeOut",
                          }}
                          className="h-full bg-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Window>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Window title="dilemmas">
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px]">
            {seenDilemmas.map((dilemma) => {
              const dilemmaTemplate = dilemmaTemplates[dilemma.title];
              if (!dilemma.updatedMoralStats) {
                return null;
              }
              const writtenStats = getMoralStatsWritten(
                dilemma.updatedMoralStats
              );
              return (
                <div key={dilemma._id} className="mb-4">
                  <p>
                    <u>dilemma:</u>{" "}
                    {dilemmaTemplate.text.replace("{pet}", pet.name)}
                  </p>
                  <p>
                    <u>caretaker said:</u> {dilemma.responseText}
                  </p>
                  <p>
                    <u>then:</u> {dilemma.outcome}
                  </p>
                  <p className="flex gap-2 italic opacity-50">
                    {writtenStats.map((stat) => (
                      <span
                        key={stat.key}
                        style={{
                          opacity:
                            stat.percentage > 50
                              ? 1
                              : stat.percentage > 30
                                ? 0.8
                                : 0.5,
                        }}
                      >
                        {stat.description}
                      </span>
                    ))}
                  </p>
                </div>
              );
            })}
          </div>
        </Window>
      </motion.div>
      <motion.div
        className="flex justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        want to try again?{" "}
        <a href="/play" className="text-indigo-600">
          adopt a new pet
        </a>
      </motion.div>
    </div>
  );
}
