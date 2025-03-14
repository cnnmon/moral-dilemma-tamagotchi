"use client";

import { motion, AnimatePresence } from "framer-motion";

const pathToText = {
  play: "home > living room",
  create: "adoption center",
  about: "about princi/pal",
  scrapbook: "pet scrapbook",
};

export default function Menu({
  page,
  currentPetName,
}: {
  page: "play" | "create" | "scrapbook" | "about";
  currentPetName?: string;
}) {
  if (page === "about" || page === "scrapbook") {
    return (
      <div className="fixed top-0 text-sm text-zinc-500 p-4 z-10 flex gap-4 justify-between w-full">
        <AnimatePresence>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="ml-2"
          >
            {`${pathToText[page]}`}
          </motion.span>
        </AnimatePresence>
        <div className="flex gap-2">
          <AnimatePresence>
            <motion.a
              href="/play"
              className="hover:text-zinc-800 no-drag"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              back
            </motion.a>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 text-sm text-zinc-500 p-4 z-10 flex gap-4 justify-between w-full">
      <AnimatePresence>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="ml-2"
        >
          {`${pathToText[page]}${
            currentPetName && page === "play" ? ` > ${currentPetName}` : ""
          }`}
        </motion.span>
      </AnimatePresence>
      <div className="flex flex-col gap-2 text-right">
        <AnimatePresence>
          {currentPetName && (
            <motion.a
              href="/create"
              className="hover:text-zinc-800 no-drag"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              abandon {currentPetName}
            </motion.a>
          )}
        </AnimatePresence>

        <AnimatePresence>
          <motion.a
            href="/scrapbook"
            className="hover:text-zinc-800 no-drag"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            scrapbook
          </motion.a>
        </AnimatePresence>

        <AnimatePresence>
          <motion.a
            href="/about"
            className="hover:text-zinc-800 no-drag"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            about
          </motion.a>
        </AnimatePresence>
      </div>
    </div>
  );
}
