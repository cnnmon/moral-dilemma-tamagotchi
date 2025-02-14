import { getMoralStatsWritten, MoralDimensionsType } from "@/constants/morals";

export function MoralStats({
  moralStats,
}: {
  moralStats: MoralDimensionsType;
}) {
  const moralStatsWritten = getMoralStatsWritten(moralStats);
  return (
    <div className="flex gap-2">
      <p>traits:</p>
      {moralStatsWritten.length ? (
        moralStatsWritten.map(({ key, description, percentage }) => (
          <span
            key={key}
            title={`${percentage}%`}
            className={`${
              percentage > 60
                ? "text-black"
                : percentage > 30
                  ? "text-zinc-500"
                  : "text-zinc-400"
            }`}
          >
            {description}
          </span>
        ))
      ) : (
        <span className="text-zinc-400 animate-pulse">moral uncertainty</span>
      )}
    </div>
  );
}
