import { AnimatePresence, motion } from "framer-motion";

export default function Stat({
  label,
  value, // out of 100
  displayValue,
  dangerous,
  barStyle = { width: "100%" },
  containerStyle = { justifyContent: "start" },
  customBarColor,
  decrement,
  increment,
  hideSkull = false,
  useLerpColors = false,
  disabled = false,
}: {
  label?: string;
  value: number;
  displayValue?: string;
  dangerous?: boolean;
  barStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  customBarColor?: string;
  decrement?: number;
  increment?: number;
  hideSkull?: boolean;
  useLerpColors?: boolean;
  disabled?: boolean;
}) {
  const dangerousValue = dangerous ?? value < 25;
  const scaledIncrement = increment ? Math.round(increment * 10) : 0;
  const scaledDecrement = decrement ? Math.round(decrement * 10) : 0;

  // color lerp for progress bar
  const getProgressColor = () => {
    if (!useLerpColors) return {};

    // normalize value between 0 and 1
    const progress = Math.min(Math.max(value, 0), 100) / 100;

    // color stops (rgb values)
    const colors = [
      { r: 147, g: 51, b: 234 }, // purple-600
      { r: 59, g: 130, b: 246 }, // blue-500
      { r: 16, g: 185, b: 129 }, // emerald-500
    ];

    // determine which segment we're in
    let segment = Math.floor(progress * (colors.length - 1));
    if (segment >= colors.length - 1) segment = colors.length - 2;

    // calculate progress within this segment
    const segmentProgress = progress * (colors.length - 1) - segment;

    // lerp between colors
    const start = colors[segment];
    const end = colors[segment + 1];

    const r = Math.round(start.r + (end.r - start.r) * segmentProgress);
    const g = Math.round(start.g + (end.g - start.g) * segmentProgress);
    const b = Math.round(start.b + (end.b - start.b) * segmentProgress);

    return { backgroundColor: `rgb(${r},${g},${b})` };
  };

  return (
    <div
      className={`flex w-full justify-start items-center gap-2 mb-[-4px] ${
        disabled ? "opacity-50" : ""
      }`}
      style={containerStyle}
    >
      {label && <p className="min-w-28">{label}</p>}
      <div className="border-2 h-3 border-black relative" style={barStyle}>
        {value === 0 && !hideSkull ? (
          <div className="absolute inset-0 mt-1 flex items-center justify-center text-sm">
            ☠️
          </div>
        ) : (
          <div
            className={`h-full ${!useLerpColors ? customBarColor || (dangerousValue ? "bg-red-500" : "bg-zinc-500") : ""} transition-all duration-100`}
            style={{
              width: `${value}%`,
              ...getProgressColor(),
            }}
          ></div>
        )}
      </div>
      {displayValue && (
        <p
          className={`text-xs ${
            displayValue.length > 10 ? "w-28" : ""
          } text-right`}
        >
          {displayValue}
        </p>
      )}
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
