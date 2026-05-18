import { getMoralStatsWritten, MoralDimensionsType } from "@/constants/morals";
import { motion, AnimatePresence } from "framer-motion";
import { useHoverText } from "@/app/providers/PetProvider";

const TERM_DESCRIPTIONS: Record<string, string> = {
  "logical": "prioritizes reason and analysis over emotion",
  "emotional": "lets feelings drive moral decisions",
  "forgiving": "believes in mercy and second chances",
  "punishing": "believes wrongdoing must have consequences",
  "personally integrous": "acts on personal values, independent of others",
  "loyal": "prioritizes commitment to people over personal principles",
  "autonomous": "acts on independent judgment, free from authority",
  "authoritarian": "values order, structure, and rule enforcement",
  "indulgent": "embraces pleasure and self-gratification",
  "virtuous": "adheres strictly to a moral code",
  "self-serving": "acts primarily in their own interest",
  "self-sacrificing": "consistently puts others' needs above their own",
};

export function MoralStats({
  moralStats,
}: {
  moralStats: MoralDimensionsType;
}) {
  const moralStatsWritten = getMoralStatsWritten(moralStats);
  const { setHoverText } = useHoverText();

  return (
    <div className="flex flex-col" style={{ zIndex: -2 }}>
      <AnimatePresence mode="popLayout">
        {moralStatsWritten.length ? (
          moralStatsWritten.map(({ key, description, percentage }) => {
            const baseDesc = description.replace(/^(highly |moderately )/, "");
            const tooltip = TERM_DESCRIPTIONS[baseDesc];
            return (
              <motion.span
                key={key}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                title={`${Math.round(percentage)}%`}
                className={`cursor-default pointer-events-auto ${
                  percentage >= 50
                    ? "text-black"
                    : percentage >= 25
                      ? "text-zinc-700"
                      : percentage >= 10
                        ? "text-zinc-500"
                        : "text-zinc-400"
                }`}
                onMouseEnter={() => tooltip && setHoverText(tooltip)}
                onMouseLeave={() => setHoverText(null)}
              >
                {description} {Math.round(percentage)}%
              </motion.span>
            );
          })
        ) : (
          <motion.span
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-zinc-700 animate-pulse no-select"
          >
            moral uncertainty
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
