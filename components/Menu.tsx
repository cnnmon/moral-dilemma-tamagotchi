"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Menu() {
  const [currentPath, setCurrentPath] = useState("");
  const currentPet = useQuery(api.pets.getActivePet);

  useEffect(() => {
    if (window !== undefined) {
      setCurrentPath(window.location.pathname.slice(1));
    }
    // important because does not update properly if rerouted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  const pathToText = {
    play: "home > living room",
    create: "adoption center",
    about: "about princi/pal",
  };

  return (
    <div className="fixed top-0 text-sm text-zinc-500 p-4 z-10 flex gap-4 justify-between w-full">
      <AnimatePresence>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="ml-2"
        >
          {`${pathToText[currentPath as keyof typeof pathToText]}${
            currentPet && currentPath === "play" ? ` > ${currentPet.name}` : ""
          }`}
        </motion.span>
      </AnimatePresence>
      <div className="flex gap-2">
        {currentPet && currentPath !== "play" && (
          <a href="/play" className="hover:text-zinc-800 no-drag">
            resume game: {currentPet.name}
          </a>
        )}
        {currentPath !== "create" && currentPath !== "about" && (
          <a href="/create" className="hover:text-zinc-800 no-drag">
            new pet
          </a>
        )}
        {currentPath !== "about" && (
          <a href="/about" className="hover:text-zinc-800 no-drag">
            about
          </a>
        )}
      </div>
    </div>
  );
}
