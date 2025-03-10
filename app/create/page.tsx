"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Window from "@/components/Window";
import { Background } from "@/components/Background";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Choices from "@/components/Choices";
import WindowTextarea from "@/components/WindowTextarea";
import { useAchievements } from "../hooks/useAchievements";
import { useOutcomes } from "../play/utils/useOutcomes";
import { OutcomePopup } from "../play/components/Outcome";

function Content() {
  const createPet = useMutation(api.pets.createPet);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // generate a unique user ID if not already set
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      const newUserId = `user_${Date.now()}`;
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    } else {
      setUserId(storedUserId);
    }
  }, []);

  const { outcomes, addOutcome, removeOutcome } = useOutcomes();
  const { earnAchievement } = useAchievements(addOutcome);

  // handle omelette achievement
  useEffect(() => {
    if (userId && selectedChoice === 1) {
      earnAchievement("choose_omelette");
    }
  }, [userId, selectedChoice, earnAchievement]);

  const handleSubmit = async (name: string) => {
    // start game
    await createPet({ name });
    window.location.href = "/play";
  };

  const handleChoiceSelect = (choice: number) => {
    setSelectedChoice(choice);
  };

  if (selectedChoice === 1) {
    return (
      <motion.div
        key="cooking"
        className="flex flex-col items-center gap-4 w-full sm:w-xl p-4 sm:p-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Background backgroundSrcs={["/stove.png"]}>
          <Image
            src="/pan.gif"
            alt="pan"
            width={180}
            height={180}
            className="transform translate-x-27 no-select"
          />
        </Background>
        <br />
        <Window title="you didn't want the egg">
          <p>well... i hope you&apos;re happy with yourself.</p>
          <a
            className="cursor-pointer no-drag"
            onClick={() => setSelectedChoice(null)}
          >
            im sorry i didn&apos;t mean it
          </a>
        </Window>

        {/* Outcomes for achievements */}
        <div className="fixed top-0 p-4 w-full max-w-lg z-30">
          <AnimatePresence>
            {outcomes.map((outcome) => (
              <motion.div
                key={outcome.id}
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
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        key="create-page"
        className="flex flex-col items-center gap-4 w-full sm:w-xl p-4 sm:p-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Background backgroundSrcs={["/uwantahand.png"]}>
          <Image
            src="/egg.gif"
            alt="egg"
            width={180}
            height={180}
            className="no-select"
          />
        </Background>
        <br />
        <WindowTextarea
          title="event! ( ˶°ㅁ°) ! ! !"
          exitable={false}
          isOpen={true}
          setIsOpen={(isOpen) => {
            if (!isOpen) {
              setSelectedChoice(null);
            }
          }}
          isTextareaOpen={selectedChoice !== null}
          placeholder="give it a cool name like uh... chadd."
          handleSubmit={handleSubmit}
          isDisabled={false}
        >
          <Choices
            setSelectedChoice={handleChoiceSelect}
            dilemmaText="you've found an egg. it seems sentient."
            selectedChoice={selectedChoice}
            choices={[
              {
                text: "cool!! i'll name it...",
              },
              {
                text: "i'll make it into an omelette",
              },
            ]}
          />
        </WindowTextarea>

        {/* Outcomes for achievements */}
        <AnimatePresence>
          <div className="fixed top-0 p-4 w-full max-w-lg z-30">
            {outcomes.map((outcome) => (
              <motion.div
                key={outcome.id}
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
          </div>
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default function CreatePage() {
  return (
    <AnimatePresence mode="wait">
      <Content />
    </AnimatePresence>
  );
}
