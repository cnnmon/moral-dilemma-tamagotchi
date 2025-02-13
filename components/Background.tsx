import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo } from "react";

export const VIEWPORT_WIDTH = 570;
export const VIEWPORT_HEIGHT = 230;

export function Background({
  backgroundSrcs,
  children,
}: {
  backgroundSrcs: string[];
  children: React.ReactNode;
}) {
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
          style={{
            // disable aspect ratio warning
            height: VIEWPORT_HEIGHT,
            width: `min(calc(100% - 30px), ${VIEWPORT_WIDTH}px)`,
            objectFit: "cover",
          }}
          className="absolute w-full"
        />
      )),
    [backgroundSrcs]
  );

  return (
    <div className="w-full">
      <motion.div
        key="background-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
        style={{
          maxWidth: VIEWPORT_WIDTH,
        }}
      >
        {memoizedBackgroundImages}
        <div className="z-10">{children}</div>
      </motion.div>
    </div>
  );
}
