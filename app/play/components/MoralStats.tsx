import { getMoralStatsWritten, MoralDimensionsType } from "@/constants/morals";
import { motion, AnimatePresence } from "framer-motion";

export function MoralStats({
  moralStats,
}: {
  moralStats: MoralDimensionsType;
}) {
  const moralStatsWritten = getMoralStatsWritten(moralStats);

  return (
    <div className="flex flex-col text-right" style={{ zIndex: -2 }}>
      <AnimatePresence mode="popLayout">
        {moralStatsWritten.length ? (
          moralStatsWritten.map(({ key, description, percentage }) => (
            <motion.span
              key={key}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              title={`${Math.round(percentage)}%`}
              className={`${
                percentage >= 50
                  ? "text-black"
                  : percentage >= 25
                    ? "text-zinc-700"
                    : percentage >= 10
                      ? "text-zinc-500"
                      : "text-zinc-400"
              }`}
            >
              {description} {Math.round(percentage)}%
            </motion.span>
          ))
        ) : (
          <motion.span
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-zinc-400 animate-pulse no-select"
          >
            moral uncertainty
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
