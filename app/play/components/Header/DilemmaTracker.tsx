import { usePet } from "@/app/providers/PetProvider";
import Window from "@/components/Window";

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

export function DilemmaTracker({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { pet } = usePet();
  if (!pet || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-zinc-500/50">
      <div className="w-full max-w-2xl">
        <Window title={`dilemma tracker`} isOpen={isOpen} setIsOpen={setIsOpen}>
          <div className="max-h-[80vh] overflow-y-auto space-y-4 p-4">
            {pet.dilemmas.length === 0 && (
              <p className="text-zinc-500 italic">
                no dilemmas yet. start talking to {pet.name}!
              </p>
            )}
            {pet.dilemmas.map((dilemma, index) => (
              <div key={index} className="space-y-2">
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
}
