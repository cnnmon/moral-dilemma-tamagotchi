import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export const VIEWPORT_WIDTH = 570 * 1.3;
export const VIEWPORT_HEIGHT = 230 * 1.3;

export function Background({
  backgroundSrcs,
  hasOverlay = false,
  isAlmostDead = false,
  children,
}: {
  backgroundSrcs: string[];
  hasOverlay?: boolean;
  isAlmostDead?: boolean;
  children?: React.ReactNode;
}) {
  // state to track loaded images
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  // memoize the background images
  const memoizedBackgroundImages = useMemo(
    () =>
      backgroundSrcs.map((src) => (
        <Image
          key={src}
          src={src}
          alt="background"
          width={VIEWPORT_WIDTH}
          height={VIEWPORT_HEIGHT}
          priority={true}
          className={twMerge(
            "absolute w-full h-full transition-opacity duration-500 pointer-events-none object-cover",
            loadedImages.includes(src) ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => {
            setLoadedImages((prev) => [...prev, src]);
          }}
        />
      )),
    [backgroundSrcs, loadedImages],
  );

  return (
    <AnimatePresence key="bg">
      <motion.div
        key="fade-in-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-white pointer-events-none z-30"
      />

      <div className="w-full flex items-center justify-center relative">
        <motion.div
          key="background-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
          style={{
            maxWidth: VIEWPORT_WIDTH,
            height: VIEWPORT_HEIGHT,
          }}
        >
          {isAlmostDead && (
            <div className="absolute w-full h-full bg-red-500/50 opacity-75" />
          )}
          {hasOverlay && (
            <Image
              src="/walnut.png"
              alt="background"
              width={VIEWPORT_WIDTH}
              height={VIEWPORT_HEIGHT}
              priority={true}
              className="absolute w-full"
              style={{
                height: VIEWPORT_HEIGHT,
                width: `min(calc(100% - 30px), ${VIEWPORT_WIDTH}px)`,
                objectFit: "cover",
                zIndex: 10,
                mixBlendMode: "multiply",
                filter: "brightness(1.2)",
                pointerEvents: "none",
              }}
            />
          )}
          {memoizedBackgroundImages}
          <div className="z-10 pointer-events-none">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
