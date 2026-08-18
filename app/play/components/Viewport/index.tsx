import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Background, VIEWPORT_WIDTH } from "@/components/Background";
import { VIEWPORT_HEIGHT } from "@/components/Background";
import Outcome from "../Outcome";
import { AnimatePresence, motion } from "framer-motion";
import { RIP_SPRITE, getSprite } from "@/constants/sprites";
import {
  useBaseStats,
  useDilemma,
  usePet,
  useHoverText,
  useOutcome,
} from "@/app/providers/PetProvider";
import { EvolutionId } from "@/constants/evolutions";
import { ActiveDilemma } from "@/app/storage/pet";
import { getRandomUnseenDilemma } from "@/app/utils/dilemma";
import { dilemmas } from "@/constants/dilemmas";
import { BaseStatKeys } from "@/constants/base";
import FeatheredScroll from "@/components/FeatheredScroll";

function ConversationScroll({
  messages,
}: {
  messages: ActiveDilemma["messages"];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // only assistant messages (pet's clarifying questions), newest first
  const petMessages = messages
    .filter((m) => m.role === "assistant")
    .slice()
    .reverse();

  // keep the newest bubble pinned at the top when a new one arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [messages.length]);

  if (!petMessages.length) return null;

  return (
    <motion.div
      className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <FeatheredScroll
        ref={scrollRef}
        direction="vertical"
        className="max-h-full flex-col gap-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {petMessages.map((msg, i) => (
          <p
            key={`${petMessages.length - i}`}
            className="w-full shrink-0 px-3 py-2 bg-zinc-100 border-2 border-black text-lg"
          >
            {msg.content}
          </p>
        ))}
      </FeatheredScroll>
    </motion.div>
  );
}
// local storage key for tracking if egg animation has been shown
export const EGG_CRACK_SHOWN_KEY = "egg_crack_animation_shown";

const LOW_STAT_THRESHOLD = 3;
const LOW_STAT_MESSAGES: Record<string, string> = {
  hunger: "i'm hungry… (￣﹃￣)",
  health: "i don't feel so good (ᵕ–﹏–)🌡️",
  happiness: "i need someone to play with… (｡•́︿•̀｡)",
  sanity: "i have a problem… ( ˶•ᴖ•) !!",
};

const STAT_HOVER: Record<string, string> = {
  hunger: "feed (+hunger)",
  health: "heal (+health)",
  happiness: "play (+happiness)",
  sanity: "answer dilemma (+sanity)",
};

const Viewport = React.memo(function Viewport({
  onHealClick,
  onFeedClick,
  onPlayClick,
  onTalkClick,
}: {
  onHealClick?: () => void;
  onFeedClick?: () => void;
  onPlayClick?: () => void;
  onTalkClick?: () => void;
}) {
  const { pet, animation, updatePet } = usePet();
  const { dilemma, setDilemma } = useDilemma();
  const { setHoverText } = useHoverText();
  const { baseStats, poos, cleanupPoo, incrementStat } = useBaseStats();
  const { hideOutcome } = useOutcome();
  const [isAlmostDead, setIsAlmostDead] = useState(false);

  const handleSanityClick = useCallback(() => {
    if (!pet) return;
    const newDilemma = getRandomUnseenDilemma(pet);
    if (newDilemma) {
      const existing = pet.dilemmas.find((d) => d.id === newDilemma.id && !d.completed);
      if (!existing) {
        updatePet({ dilemmas: [...pet.dilemmas, { id: newDilemma.id, messages: [], completed: false }] });
      }
      setDilemma({
        ...newDilemma,
        messages: existing?.messages.length
          ? existing.messages
          : [{ role: "system", content: dilemmas[newDilemma.id].text.replaceAll("{pet}", pet.name) }],
      });
      hideOutcome();
      onTalkClick?.();
    } else {
      incrementStat(BaseStatKeys.sanity);
    }
  }, [pet, updatePet, setDilemma, incrementStat, onTalkClick, hideOutcome]);

  // find the lowest stat below threshold for speech bubble
  const speechBubble = useMemo(() => {
    if (!pet || pet.age >= 3 || pet.evolutionIds.includes(EvolutionId.RIP))
      return null;
    const lowest = Object.entries(baseStats)
      .filter(([, v]) => v < LOW_STAT_THRESHOLD)
      .sort(([, a], [, b]) => a - b)[0];
    if (!lowest) return null;
    const [key] = lowest;
    return { key, message: LOW_STAT_MESSAGES[key] };
  }, [baseStats, pet]);

  // show grumble when pet is "thinking" (last message is from user, awaiting response)
  const isThinking = useMemo(() => {
    if (!dilemma || dilemma.completed) return false;
    const last = [...dilemma.messages]
      .reverse()
      .find((m) => m.role !== "system");
    return last?.role === "user";
  }, [dilemma]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const prevStatsRef = useRef(baseStats);

  // Initialize showEggCrack based on localStorage to avoid timing issues
  const [showEggCrack, setShowEggCrack] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem(EGG_CRACK_SHOWN_KEY);
    }
    return false;
  });

  // egg crack animation should be shown on first render
  useEffect(() => {
    if (showEggCrack) {
      const timer = setTimeout(() => {
        setShowEggCrack(false);
        localStorage.setItem(EGG_CRACK_SHOWN_KEY, "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showEggCrack]);

  const petSprite = useMemo(() => {
    if (!pet) {
      return null;
    }
    if (pet.evolutionIds.includes(EvolutionId.RIP)) {
      return RIP_SPRITE;
    }
    const sprite = getSprite(
      animation,
      pet.evolutionIds[pet.evolutionIds.length - 1],
    );
    if (!sprite) {
      throw new Error(
        `no sprite found for ${pet.age}, ${animation}, ${pet.evolutionIds[0]}`,
      );
    }
    return sprite;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation, pet?.evolutionIds]);

  // Debounce stat changes to reduce re-renders
  useEffect(() => {
    // Only update if stats actually changed significantly
    const hasSignificantChange = Object.keys(baseStats).some((key) => {
      const statKey = key as keyof typeof baseStats;
      return Math.abs(baseStats[statKey] - prevStatsRef.current[statKey]) > 0.5;
    });

    if (hasSignificantChange) {
      const timer = setTimeout(() => {
        setIsAlmostDead(
          (baseStats.hunger < 2 && baseStats.hunger > 0) ||
            (baseStats.health < 2 && baseStats.health > 0) ||
            (baseStats.happiness < 2 && baseStats.happiness > 0) ||
            (baseStats.sanity < 2 && baseStats.sanity > 0),
        );
        prevStatsRef.current = baseStats;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [baseStats]);

  // undo effects when graduated
  useEffect(() => {
    if (pet?.age && pet.age >= 3) {
      setIsAlmostDead(false);
    }
  }, [pet?.age]);

  // Preload critical images
  useEffect(() => {
    if (petSprite) {
      const img = new window.Image();
      img.onload = () => setImagesLoaded(true);
      img.src = petSprite;
    }
  }, [petSprite]);

  return (
    <div
      style={{
        maxWidth: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
      }}
      className="relative flex items-center justify-center no-drag flex-1 overflow-hidden"
    >
      {/* Lazy load poos after main content */}
      {imagesLoaded &&
        poos.map(({ id, x, y }) => {
          const left = x;
          const top = y + 10;
          return (
            <div
              key={id}
              className="absolute z-20 cursor-pointer hover:opacity-50 transition-opacity"
              style={{ transform: `translate(${left}px, ${top}px)` }}
              onClick={() => cleanupPoo(id)}
              onMouseEnter={() => setHoverText("pick up (-poo)")}
              onMouseLeave={() => setHoverText(null)}
            >
              <Image
                src="/poo.gif"
                width={VIEWPORT_WIDTH / 15}
                height={VIEWPORT_HEIGHT / 15}
                className="visual"
                alt="poo"
                loading="lazy"
              />
            </div>
          );
        })}

      {/* conversation thread — only back-and-forth, shown when there are messages */}
      <AnimatePresence>
        {dilemma && dilemma.messages.length > 0 && (
          <ConversationScroll messages={dilemma.messages} />
        )}
      </AnimatePresence>

      {/* grumble gif — shown while pet is thinking */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            className="absolute z-20 top-2 right-2 pointer-events-none"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <Image src="/grumble.gif" alt="thinking" width={60} height={60} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* speech bubble for low stats */}
      <AnimatePresence>
        {speechBubble && !dilemma && (
          <motion.div
            key={speechBubble.key}
            className="absolute z-50 w-xs bg-zinc-100 border-2 px-3 py-2 mt-[-20px] text-center hover:opacity-70! cursor-pointer pointer-events-auto"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4 }}
            onMouseEnter={() =>
              setHoverText(STAT_HOVER[speechBubble.key] ?? null)
            }
            onMouseLeave={() => setHoverText(null)}
            onClick={() => {
              if (speechBubble.key === "health") onHealClick?.();
              else if (speechBubble.key === "hunger") onFeedClick?.();
              else if (speechBubble.key === "happiness") onPlayClick?.();
              else if (speechBubble.key === "sanity") handleSanityClick();
            }}
          >
            <p>{speechBubble.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Outcome />

      <Background
        hasOverlay
        isAlmostDead={isAlmostDead}
        backgroundSrcs={["/background.png", "/trees.gif"]}
      >
        <div className="relative">
          <div className="relative">
            <AnimatePresence mode="wait">
              {showEggCrack && (
                <motion.div
                  className="absolute top-[63px] left-[-20px] w-[180px] h-[150px] z-10 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Image
                    src="/egg_crack.gif"
                    alt="egg cracking"
                    width={VIEWPORT_WIDTH / 5}
                    height={VIEWPORT_HEIGHT / 5}
                    className="absolute w-full h-full"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              key={`bird-${showEggCrack}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: showEggCrack ? 1.4 : 0.1 }}
              className="pointer-events-none"
            >
              {petSprite && (
                <Image
                  src={petSprite}
                  alt="birb"
                  width={VIEWPORT_WIDTH / 5}
                  height={VIEWPORT_HEIGHT / 5}
                  priority
                  className="translate-y-[30%] no-select"
                />
              )}
            </motion.div>
          </div>
        </div>
      </Background>
    </div>
  );
});

export default Viewport;
