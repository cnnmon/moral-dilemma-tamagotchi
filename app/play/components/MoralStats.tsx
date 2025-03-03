import { getMoralStatsWritten, MoralDimensionsType } from "@/constants/morals";
import { motion, AnimatePresence } from "framer-motion";

export function MoralStats({
  moralStats,
}: {
  moralStats: MoralDimensionsType;
}) {
  const moralStatsWritten = getMoralStatsWritten(moralStats);

  return (
    <div className="flex flex-col text-right">
      <AnimatePresence mode="popLayout">
        {moralStatsWritten.length ? (
          moralStatsWritten.map(({ key, description, percentage }) => (
            <motion.span
              key={key}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              title={`${Math.round(percentage * 100) / 100}%`}
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
              {description} {Math.round(percentage * 100) / 100}%
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
