"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Background } from "@/components/Background";
import Image from "next/image";
import Window from "@/components/Window";
import WindowTextarea from "@/components/WindowTextarea";
import { createPet } from "../storage/pet";

function Content() {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const handleSubmit = async (userInput: string) => {
    const name = userInput.trim().toLowerCase();
    if (!name) {
      console.error("❌ No name provided");
      return;
    }

    // if "no" or similar is in the name, set selected choice to 1
    if (name.includes("no") || name.includes("nah") || name.includes("nope")) {
      setSelectedChoice(1);
      return;
    }

    // start game
    localStorage.clear(); // TODO: REMOVE
    await createPet(name);
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
          placeholder="give it a cool name like uh... chadd."
          handleSubmit={handleSubmit}
        >
          <p>
            you&apos;ve found an egg. it seems sentient. (or{" "}
            <a className="cursor-pointer" onClick={() => setSelectedChoice(1)}>
              abandon it?
            </a>
            )
          </p>
        </WindowTextarea>
      </motion.div>
    </>
  );
}

export default function CreatePage() {
  return <Content />;
}
