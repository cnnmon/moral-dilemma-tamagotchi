import Image from "next/image";
import { motion } from "framer-motion";

export const VIEWPORT_WIDTH = 570;
export const VIEWPORT_HEIGHT = 230;

export function Background({
  backgroundSrcs,
  children,
}: {
  backgroundSrcs: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <motion.div
        key="background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
        style={{
          maxWidth: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
        }}
      >
        {backgroundSrcs.map((src) => (
          <Image
            key={src}
            src={src}
            alt="background"
            width={VIEWPORT_WIDTH}
            height={VIEWPORT_HEIGHT}
            style={{
              height: VIEWPORT_HEIGHT,
              maxWidth: VIEWPORT_WIDTH,
              objectFit: "cover",
            }}
            className="absolute w-full"
            unoptimized
          />
        ))}
        <div className="z-10">{children}</div>
      </motion.div>
    </div>
  );
}
