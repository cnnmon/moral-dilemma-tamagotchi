"use client";

import { usePet } from "@/app/providers/PetProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, forwardRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Window from "@/components/Window";

type Page = "play" | "create" | "scrapbook";

function pageFromPathname(pathname: string): Page | null {
  if (pathname.startsWith("/play")) return "play";
  if (pathname.startsWith("/create")) return "create";
  if (pathname.startsWith("/scrapbook")) return "scrapbook";
  return null;
}

type SegmentOption = {
  label: string;
  onClick?: () => void;
  children?: SegmentOption[];
};
type Segment = {
  label: string;
  onClick?: () => void;
  options?: SegmentOption[];
};

function useBreadcrumb(page: Page, showAbout: () => void): Segment[] {
  const { pet } = usePet();

  // "home" is a category — expands to living room & scrapbook
  const homeOption: SegmentOption = {
    label: "home",
    children: [
      {
        label: "living room",
        onClick: () => {
          window.location.href = "/play";
        },
      },
      {
        label: "scrapbook",
        onClick: () => {
          window.location.href = "/scrapbook";
        },
      },
    ],
  };

  const slot1: Segment =
    page === "create"
      ? { label: "orphanage", options: [homeOption] }
      : {
          label: "home",
          onClick: () => {
            window.location.href = "/play";
          },
          options: [
            {
              label: "orphanage",
              onClick: () => {
                window.location.href = "/create";
              },
            },
          ],
        };

  if (page === "play") {
    return [
      slot1,
      {
        label: "living room",
        onClick: () => {
          window.location.href = "/play";
        },
        options: [
          {
            label: "scrapbook",
            onClick: () => {
              window.location.href = "/scrapbook";
            },
          },
        ],
      },
      ...(pet ? [{ label: pet.name }] : []),
    ];
  }

  if (page === "scrapbook") {
    return [
      slot1,
      {
        label: "scrapbook",
        options: [
          {
            label: "living room",
            onClick: () => {
              window.location.href = "/play";
            },
          },
        ],
      },
    ];
  }

  return [slot1];
}

// A row in a dropdown — may itself have a children flyout
function DropdownItem({
  option,
  onClose,
  isLast,
}: {
  option: SegmentOption;
  onClose: () => void;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hasChildren = option.children && option.children.length > 0;

  return (
    <span
      ref={ref}
      className={`relative flex items-center justify-between gap-4 px-3 py-1 hover:bg-zinc-200 cursor-pointer${!isLast ? " border-b-2" : ""}`}
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => {
        if (option.onClick) {
          onClose();
          option.onClick();
        }
      }}
    >
      <span>{option.label}</span>
      {hasChildren && <span className="opacity-40 text-xs">›</span>}
      <AnimatePresence>
        {open && hasChildren && (
          <motion.div
            className="absolute left-full top-0 ml-[2px] bg-white border-2 border-black z-50 flex flex-col min-w-max"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.12 }}
          >
            {option.children!.map((child, i) => (
              <span
                key={child.label}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  child.onClick?.();
                }}
                className={`px-3 py-1 hover:bg-zinc-200 cursor-pointer${i < option.children!.length - 1 ? " border-b-2" : ""}`}
              >
                {child.label}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

// A single breadcrumb segment — hover to reveal alternatives
function BreadcrumbSegment({ segment }: { segment: Segment }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hasOptions = segment.options && segment.options.length > 0;

  return (
    <span
      ref={ref}
      className="relative"
      onMouseEnter={() => hasOptions && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {segment.onClick || hasOptions ? (
        <a onClick={segment.onClick} className="cursor-pointer hover:text-zinc-800">
          {segment.label}
        </a>
      ) : (
        <span>{segment.label}</span>
      )}
      <AnimatePresence>
        {open && hasOptions && (
          <motion.div
            className="absolute top-full left-0 mt-1 bg-white border-2 border-black z-50 flex flex-col min-w-max"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
          >
            {segment.options!.map((opt, i) => (
              <DropdownItem
                key={opt.label}
                option={opt}
                onClose={() => setOpen(false)}
                isLast={i === segment.options!.length - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

function Breadcrumb({ segments }: { segments: Segment[] }) {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {segments.map((segment, i) => (
        <span key={segment.label} className="flex items-center gap-2">
          {i > 0 && <span className="opacity-40">&gt;</span>}
          <BreadcrumbSegment segment={segment} />
        </span>
      ))}
    </motion.div>
  );
}

function AboutOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-zinc-500/20 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Window title="about" setIsOpen={onClose}>
              <div className="flex flex-col gap-2 p-4 text-lg">
                <Image
                  src="/poo.gif"
                  alt="princi(pal)"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <p>thanks for playing~</p>
                <p>
                  princi(pal) is a moral dilemma tamagotchi. it&apos;s a virtual
                  pet game where you can (finally!) impose your own ethical
                  views on said pet and watch the consequences unfold
                </p>
                <p>
                  made with{" "}
                  <a href="https://github.com/cnnmon/moral-dilemma-tamagotchi">
                    moral uncertainty
                  </a>{" "}
                  by <a href="https://tiffanywang.me/">tiff</a>
                  <br />
                  big thanks to gavin for dilemma writing help—
                  <a href="https://x.com/garvin_laughri">
                    he pinky promises to write more often
                  </a>
                </p>
              </div>
            </Window>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mobile: bottom sheet listing all options flat
const MobileMenu = forwardRef<
  HTMLDivElement,
  {
    segments: Segment[];
    isOpen: boolean;
    onClose: () => void;
    showAbout: () => void;
  }
>(({ segments, isOpen, onClose, showAbout }, ref) => {
  const allOptions = [
    ...segments.flatMap((s) =>
      (s.options ?? []).flatMap((o) =>
        o.children ? o.children : o.onClick ? [o] : [],
      ),
    ),
    { label: "about", onClick: showAbout },
  ];

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
          <div className="text-zinc-500 text-lg flex flex-col">
            {allOptions.map(({ label, onClick }, i) => (
              <motion.a
                key={label}
                onClick={() => {
                  onClose();
                  onClick?.();
                }}
                className="hover:text-zinc-800 no-drag block py-2 cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                {label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileMenu.displayName = "MobileMenu";

export default function Menu() {
  const pathname = usePathname();
  const page = pageFromPathname(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const segments = useBreadcrumb(page ?? "play", () => setAboutOpen(true));

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
    if (mobileMenuOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  if (!page) return null;

  return (
    <>
      <div className="w-full flex justify-between items-center text-zinc-500 text-lg">
        <div className="hidden md:flex items-center justify-between w-full">
          <Breadcrumb segments={segments} />
          <a
            onClick={() => setAboutOpen(true)}
            className="cursor-pointer hover:text-zinc-800 z-[90]"
          >
            about
          </a>
        </div>
        <div
          className="flex md:hidden w-full justify-between items-center relative"
          ref={menuRef}
        >
          <span className="text-zinc-500">
            {segments.map((s) => s.label).join(" > ")}
          </span>
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

      <MobileMenu
        segments={segments}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        showAbout={() => setAboutOpen(true)}
        ref={mobileMenuRef}
      />
      <AboutOverlay isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
