"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Menu() {
  const [currentPath, setCurrentPath] = useState("");
  const currentPet = useQuery(api.pets.getActivePet);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname.slice(1));
      const handleRouteChange = () => {
        setCurrentPath(window.location.pathname.slice(1));
      };
      window.addEventListener("popstate", handleRouteChange);
      return () => {
        window.removeEventListener("popstate", handleRouteChange);
      };
    }
  }, []);

  const pathToText = {
    "": "princi/pal",
    play: "home > living room",
    create: "adoption center",
    about: "about princi/pal",
    scrapbook: "pet scrapbook",
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
        <AnimatePresence>
          {currentPet && currentPath !== "play" && (
            <motion.a
              href="/play"
              className="hover:text-zinc-800 no-drag"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              resume game: {currentPet.name}
            </motion.a>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentPath !== "create" &&
            currentPath !== "about" &&
            currentPath !== "scrapbook" && (
              <motion.a
                href="/create"
                className="hover:text-zinc-800 no-drag"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                new pet
              </motion.a>
            )}
        </AnimatePresence>

        <AnimatePresence>
          {currentPath !== "scrapbook" && (
            <motion.a
              href="/scrapbook"
              className="hover:text-zinc-800 no-drag"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              scrapbook
            </motion.a>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {currentPath !== "about" && (
            <motion.a
              href="/about"
              className="hover:text-zinc-800 no-drag"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              about
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
