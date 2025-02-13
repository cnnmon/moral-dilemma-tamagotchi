"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Textarea } from "@/components/Textarea";
import Image from "next/image";
import Window from "@/components/Window";
import { Background } from "@/components/Background";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const negationText = [
  "no",
  "nah",
  "nope",
  "not",
  "no way",
  "cook",
  "dont",
  "don't",
];

function Content() {
  const createPet = useMutation(api.pets.createPet);
  const [isCooking, setIsCooking] = useState(false);

  const handleSubmit = async (response: string) => {
    // check if response is negation or a name
    const isNegation = negationText.some((text) =>
      response.toLowerCase().includes(text)
    );

    if (isNegation) {
      setIsCooking(true);
    } else {
      // start game
      localStorage.clear(); // clear local storage
      await createPet({ name: response });
      window.location.href = "/play";
    }
  };

  if (isCooking) {
    return (
      <motion.div
        key="cooking"
        className="flex flex-col items-center gap-4 w-full md:w-xl p-4 md:p-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Background backgroundSrcs={["/stove.png"]}>
          <Image src="/pan.gif" alt="pan" width={180} height={180} />
        </Background>
        <Window title="you didn't want the egg">
          <p>aww. well i hope it&apos;s yummy.</p>
          <br />
          <a className="cursor-pointer" onClick={() => setIsCooking(false)}>
            im sorry i didn&apos;t mean it
          </a>
        </Window>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="egg"
      className="flex flex-col items-center gap-4 w-full md:w-xl p-4 md:p-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Background backgroundSrcs={["/landscape.png"]}>
        <Image src="/egg.gif" alt="egg" width={180} height={180} />
      </Background>
      <Window title="event! ( ˶°ㅁ°) !!">
        <p>you&apos;ve found an egg. what do you want to name it?</p>
        <Textarea placeholder="what do you do" handleSubmit={handleSubmit} />
      </Window>
    </motion.div>
  );
}

export default function CreatePage() {
  return (
    <AnimatePresence mode="wait">
      <Content />
    </AnimatePresence>
  );
}
