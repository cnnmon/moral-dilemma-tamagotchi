"use client";

import { usePet } from "@/app/providers/PetProvider";
import { EvolutionId } from "@/constants/evolutions";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, forwardRef } from "react";

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
        >
          {`${pathToText[page]}${page === "play" ? ` > ${pet.name}` : ""}`}
        </motion.span>
      </AnimatePresence>
      <AnimatePresence>
        {pet.name && (
          <motion.a
            onClick={() => {
              if (pet.evolutionIds.includes(EvolutionId.RIP) || pet.age >= 2) {
                window.location.href = "/create";
                return;
              }
              if (
                pet.age < 2 &&
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

const MobileMenu = forwardRef<
  HTMLDivElement,
  {
    page: "play" | "create" | "scrapbook" | "about";
    isOpen: boolean;
    onClose: () => void;
  }
>(({ page, isOpen, onClose }, ref) => {
  const { pet } = usePet();

  if (!pet) {
    return null;
  }

  const menuItems = [];

  if (page === "about" || page === "scrapbook") {
    menuItems.push(
      <motion.a
        key="back"
        href="/play"
        className="hover:text-zinc-800 no-drag block py-2"
        onClick={onClose}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        back
      </motion.a>
    );
  } else {
    if (pet.name) {
      menuItems.push(
        <motion.a
          key="new-pet"
          onClick={() => {
            if (pet.evolutionIds.includes(EvolutionId.RIP) || pet.age >= 2) {
              window.location.href = "/create";
              return;
            }
            if (
              pet.age < 2 &&
              confirm(
                `are you sure you want to abandon ${pet.name}? look at ${pet.name}'s big ol eyes ( •̯́ ^ •̯̀)`
              )
            ) {
              window.location.href = "/create";
            }
          }}
          className="hover:text-zinc-800 no-drag block py-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          new pet
        </motion.a>
      );
    }

    menuItems.push(
      <motion.a
        key="scrapbook"
        href="/scrapbook"
        className="hover:text-zinc-800 no-drag block py-2"
        onClick={onClose}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        scrapbook
      </motion.a>
    );

    menuItems.push(
      <motion.a
        key="about"
        href="/about"
        className="hover:text-zinc-800 no-drag block py-2"
        onClick={onClose}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        about
      </motion.a>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black z-50 p-4"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-zinc-500 text-lg">{menuItems}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileMenu.displayName = "MobileMenu";

export default function Menu({
  page,
}: {
  page: "play" | "create" | "scrapbook" | "about";
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="w-full flex justify-between text-zinc-500 text-lg">
        {/* Desktop Menu */}
        <div className="hidden md:flex w-full justify-between">
          <MenuContent page={page} />
        </div>

        {/* Mobile Menu Button */}
        <div
          className="flex md:hidden w-full justify-between items-center relative"
          ref={menuRef}
        >
          <span className="ml-2 text-zinc-500">{`${pathToText[page]}`}</span>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="border-2 w-8 h-8 flex flex-col items-center justify-center hover:bg-zinc-100"
          >
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="16" height="2" fill="currentColor" />
              <rect y="5" width="16" height="2" fill="currentColor" />
              <rect y="10" width="16" height="2" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        page={page}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        ref={mobileMenuRef}
      />
    </>
  );
}
