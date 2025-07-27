import { usePet, useHoverText } from "@/app/providers/PetProvider";
import { EvolutionId, getEvolutionTimeFrame } from "@/constants/evolutions";
import ActionButtons from "./ActionButtons";
import { useState } from "react";
import Window from "@/components/Window";
import { dilemmas } from "@/constants/dilemmas";

function Message({ message }: { message: { role: string; content: string } }) {
  const { pet } = usePet();
  if (!pet) {
    return null;
  }

  if (message.role === "system") {
    return (
      <div className="flex flex-wrap gap-1 text-lg">{message.content}</div>
    );
  }

  if (message.role === "assistant") {
    return (
      <div className="flex justify-end">
        <p className="w-2/3 border-2 p-2 bg-white flex flex-col">
          <span className="font-bold">{pet.name}</span>
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="w-full border-2 p-2 flex flex-col bg-white">
        <span className="font-bold">you</span>
        {message.content}
      </p>
    </div>
  );
}

export default function Header({
  onHealClick,
  onPlayClick,
}: {
  onHealClick?: () => void;
  onPlayClick?: () => void;
}) {
  const { pet, evolution } = usePet();
  const { setHoverText } = useHoverText();
  const [showMessageLog, setShowMessageLog] = useState(false);

  if (!pet || !evolution) {
    return null;
  }

  const timeFrame = getEvolutionTimeFrame(pet.age);
  const hasGraduated = pet.age >= 2; // Age 2 is the max before graduation
  const hasRip = pet.evolutionIds.includes(EvolutionId.RIP);

  const MessageLogPopup = () => {
    if (!showMessageLog) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-[100] bg-zinc-500/50">
        <div className="w-full max-w-2xl">
          <Window
            title={`dilemma tracker`}
            isOpen={showMessageLog}
            setIsOpen={setShowMessageLog}
          >
            <div className="max-h-[80vh] overflow-y-auto space-y-4 p-4">
              {pet.dilemmas.length === 0 && (
                <p className="text-zinc-500 italic">
                  no dilemmas yet. start talking to {pet.name}!
                </p>
              )}
              {pet.dilemmas.map((dilemma, index) => (
                <div key={index} className="space-y-2">
                  <Message
                    message={{
                      role: "system",
                      content: dilemmas[dilemma.id].text.replaceAll(
                        "{pet}",
                        pet.name
                      ),
                    }}
                  />
                  {dilemma.messages.map((message, msgIndex) => (
                    <div key={msgIndex}>
                      <Message message={message} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Window>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col bg-white border-2">
        <div className="flex w-full">
          <div className="w-1/3">
            <ActionButtons
              onHealClick={onHealClick}
              onPlayClick={onPlayClick}
            />
          </div>
          <div className="border-l-2 p-4 w-full text-lg flex flex-col gap-2">
            <p className="flex items-center gap-1 pointer-events-auto flex-wrap">
              &quot;{pet.name}&quot;{" "}
              {hasGraduated
                ? "has graduated as a"
                : hasRip
                  ? "has died as a"
                  : "is a"}
              <span
                className="underline hover:bg-zinc-500 hover:text-white cursor-default"
                onMouseEnter={() => setHoverText(`level ${pet.age + 1} of 3`)}
                onMouseLeave={() => setHoverText(null)}
              >
                level {pet.age + 1}
              </span>
              <span
                className="underline hover:bg-zinc-500 hover:text-white cursor-default"
                onMouseEnter={() => setHoverText(evolution.description)}
                onMouseLeave={() => setHoverText(null)}
              >
                {evolution.id}
              </span>
              .{" "}
              <a
                className="text-zinc-500 hover:text-zinc-700 underline cursor-pointer"
                onClick={() => setShowMessageLog(true)}
                onMouseEnter={() => setHoverText("view dilemmas")}
                onMouseLeave={() => setHoverText(null)}
              >
                {hasGraduated
                  ? `(${pet.dilemmas.length} dilemmas completed)`
                  : `(${pet.dilemmas.length}/${timeFrame} dilemmas until ${pet.age === 2 ? "graduation" : "evolution"})`}
              </a>
            </p>

            <p className="italic border-2 p-2 h-29 overflow-y-scroll pointer-events-auto">
              {pet.personality || "no personality yet."}
            </p>
          </div>
        </div>
      </div>

      <MessageLogPopup />
    </>
  );
}
