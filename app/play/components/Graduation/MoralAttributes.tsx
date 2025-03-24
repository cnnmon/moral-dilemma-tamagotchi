import { Doc } from "@/convex/_generated/dataModel";
import { MoralDimensions, attributes } from "@/constants/morals";

const moralAttributeEmojis = {
  [MoralDimensions.dominance]: "👑",
  [MoralDimensions.compassion]: "💕",
  [MoralDimensions.devotion]: "👬",
  [MoralDimensions.ego]: "💪",
  [MoralDimensions.purity]: "😇",
  [MoralDimensions.retribution]: "💀",
};

interface MoralAttributesProps {
  pet: Doc<"pets">;
}

export default function MoralAttributes({ pet }: MoralAttributesProps) {
  return (
    <div>
      <h3 className="text-sm font-medium border-b border-zinc-200 pb-1 mb-3">
        moral attributes
      </h3>
      <div className="space-y-2">
        {Object.entries(pet.moralStats).map(([key, value]) => {
          const normalizedValue = Math.min(Math.max(value, 0), 10);
          const position = (normalizedValue / 10) * 100;
          const attrLabels = attributes[key as MoralDimensions];
          return (
            <div key={key} className="border-x border-zinc-800 px-3 py-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">
                  {key} {moralAttributeEmojis[key as MoralDimensions]}
                </span>
                <span className="text-zinc-500 text-sm">
                  {value.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="w-1/4 truncate">{attrLabels.low}</span>
                <div className="flex-1 h-2 bg-zinc-200 relative">
                  <div
                    className="absolute top-0 h-3 w-0.5 bg-zinc-800 -mt-0.75"
                    style={{ left: `${position}%` }}
                  />
                </div>
                <span className="w-1/4 text-right">{attrLabels.high}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
