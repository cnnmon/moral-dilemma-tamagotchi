import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

export const VIEWPORT_WIDTH = 570 * 1.12;
export const VIEWPORT_HEIGHT = 230 * 1.12;

export function Background({
  backgroundSrcs,
  hasOverlay = false,
  children,
}: {
  backgroundSrcs: string[];
  hasOverlay?: boolean;
  children: React.ReactNode;
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
          style={{
            height: VIEWPORT_HEIGHT,
            width: `min(calc(100% - 30px), ${VIEWPORT_WIDTH}px)`,
            objectFit: "cover",
          }}
          className={`absolute w-full transition-opacity duration-500 pointer-events-none ${
            loadedImages.includes(src) ? "opacity-100" : "opacity-0"
          }`}
          onLoadingComplete={() => {
            setLoadedImages((prev) => [...prev, src]);
          }}
        />
      )),
    [backgroundSrcs, loadedImages]
  );

  return (
    <AnimatePresence key="bg">
      <div className="w-full flex items-center justify-center">
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
          <div className="z-10">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
