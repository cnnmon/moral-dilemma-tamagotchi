"use client";

import { usePet } from "@/app/providers/PetProvider";
import { motion, AnimatePresence } from "framer-motion";

const pathToText = {
  play: "home > living room",
  create: "adoption center",
  about: "about princi/pal",
  scrapbook: "pet scrapbook",
};

function MenuContent({
  page,
}: {
  page: "play" | "create" | "scrapbook" | "about";
}) {
  const { pet } = usePet();

  if (!pet) {
    return null;
  }

  if (page === "about" || page === "scrapbook") {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="ml-2"
        >
          {`${pathToText[page]}${page === "play" ? ` > ${pet.name}` : ""}`}
        </motion.span>
      </AnimatePresence>
      <AnimatePresence>
        {pet.name && (
          <motion.a
            onClick={() => {
              if (
                confirm(
                  `are you sure you want to abandon ${pet.name}? look at ${pet.name}'s big ol eyes ( •̯́ ^ •̯̀)`
                )
              ) {
                window.location.href = "/create";
              }
            }}
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
    </>
  );
}

export default function Menu({
  page,
}: {
  page: "play" | "create" | "scrapbook" | "about";
}) {
  return (
    <div className="w-full flex justify-between text-zinc-500">
      <MenuContent page={page} />
    </div>
  );
}
