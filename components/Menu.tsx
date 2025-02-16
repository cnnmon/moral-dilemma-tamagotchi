"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Menu({ pet }: { pet?: Doc<"pets"> }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  const currentPet = useQuery(api.pets.getActivePet);

  useEffect(() => {
    setCurrentPath(window.location.pathname.split("/")[1]);
  }, []);

  return (
    <div className="fixed top-0 left-0 text-sm text-zinc-500 p-4">
      <div className="relative">
        <a
          onClick={() => setMenuOpen(!menuOpen)}
          className="hover:text-zinc-800 no-drag"
        >
          home
        </a>
        <AnimatePresence mode="wait">
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 90 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-1 bg-white p-2 gap-1 flex flex-col w-30"
              style={{ transformOrigin: "top" }}
            >
              {currentPath !== "create" && (
                <a href="/create" className="block py-1 hover:bg-zinc-100">
                  new game
                </a>
              )}
              {currentPet && currentPath !== "play" && (
                <a href="/play" className="block py-1 hover:bg-zinc-100">
                  resume: {currentPet.name}
                </a>
              )}
              {currentPath !== "about" && (
                <a href="/about" className="block py-1 hover:bg-zinc-100">
                  about
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {` > ${currentPath}${pet ? ` > ${pet.name}` : ""}`}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
