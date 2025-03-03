import { AnimatePresence, motion } from "framer-motion";

export default function Stat({
  label,
  value, // out of 100
  dangerous,
  barStyle = { width: "100px" },
  containerStyle = { justifyContent: "start" },
  decrement,
  increment,
}: {
  label: string;
  value: number;
  dangerous?: boolean;
  barStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  decrement?: number;
  increment?: number;
}) {
  const dangerousValue = dangerous ?? value < 25;
  const scaledIncrement = increment ? Math.round(increment) : 0;
  const scaledDecrement = decrement ? Math.round(decrement) : 0;

  return (
    <div
      className="flex w-full justify-start items-center mb-[-4px]"
      style={containerStyle}
    >
      <p className="font-pixel w-18">{label}</p>
      <div className="border-2 h-3 border-black relative" style={barStyle}>
        {value === 0 ? (
          <div className="absolute inset-0 mt-1 flex items-center justify-center text-sm">
            ☠️
          </div>
        ) : (
          <div
            className={`h-full ${dangerousValue ? "bg-red-500" : "bg-black"} transition-all duration-100`}
            style={{ width: `${value}%` }}
          ></div>
        )}
      </div>
      <AnimatePresence>
        {scaledIncrement > 0 ? (
          <motion.div
            className="text-xs ml-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {scaledIncrement > 0 ? `+${scaledIncrement}` : scaledIncrement}
          </motion.div>
        ) : scaledDecrement > 0 ? (
          <motion.div
            className="text-xs ml-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {scaledDecrement > 0 ? `-${scaledDecrement}` : scaledDecrement}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
