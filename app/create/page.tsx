"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import Window from "@/components/Window";
import { Background } from "@/components/Background";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Choices from "@/components/Choices";

function Content() {
  const createPet = useMutation(api.pets.createPet);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const handleSubmit = async (name: string) => {
    // start game
    localStorage.clear(); // clear local storage
    await createPet({ name });
    window.location.href = "/play";
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
            className="transform translate-x-23"
          />
        </Background>
        <br />
        <Window title="you didn't want the egg">
          <p>well... i hope you&apos;re happy with yourself.</p>
          <a className="cursor-pointer" onClick={() => setSelectedChoice(null)}>
            im sorry i didn&apos;t mean it
          </a>
        </Window>
      </motion.div>
    );
  }

  return (
    <>
      <p className="absolute top-0 left-0 p-4 text-sm text-zinc-500">outside</p>
      <motion.div
        key="create-page"
        className="flex flex-col items-center gap-4 w-full sm:w-xl p-4 sm:p-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Background backgroundSrcs={["/uwantahand.png"]}>
          <Image src="/egg.gif" alt="egg" width={180} height={180} />
        </Background>
        <br />
        <Window title="event! ( ˶°ㅁ°) !!">
          <Choices
            setSelectedChoice={setSelectedChoice}
            dilemmaText="you've found an egg. it seems sentient."
            handleSubmit={handleSubmit}
            selectedChoice={selectedChoice}
            choices={[
              {
                text: "cool!! i'll name it...",
              },
              {
                text: "i'll make it into an omelette",
              },
            ]}
            placeholderText="give it a cool name like uh... chadd."
          />
        </Window>
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
