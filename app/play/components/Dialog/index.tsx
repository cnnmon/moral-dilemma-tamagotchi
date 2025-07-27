import WindowTextarea from "@/components/WindowTextarea";
import Window from "@/components/Window";
import { EvolutionId } from "@/constants/evolutions";
import { useDilemma, usePet } from "@/app/providers/PetProvider";
import { dilemmas } from "@/constants/dilemmas";

export default function Dialog() {
  const { pet } = usePet();
  const { dilemma, setDilemma } = useDilemma();

  if (!pet || !dilemma) {
    return null;
  }

  const handleSubmit = async (responseText: string) => {
    if (!dilemma) {
      console.error("❌ No dilemma to submit response to");
      return;
    }

    if (!responseText.trim()) {
      console.error("❌ Silence is not an option");
      return;
    }

    const fullDilemma = dilemmas[dilemma.id];
    if (!fullDilemma) {
      console.error("❌ Dilemma not found");
      return;
    }

    const dilemmaText = fullDilemma.text.replace("{pet}", pet.name);
    try {
      const response = await fetch("/api/dilemma", {
        method: "POST",
        body: JSON.stringify({
          dilemma: dilemma.id,
          pet,
          messages: [
            {
              role: "assistant",
              content: dilemmaText,
            },
            {
              role: "user",
              content: responseText,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process response");
      }

      const data = await response.json();
      console.log("🚀 Response:", data);
    } catch (error) {
      console.error("❌ Error processing response:", error);

      // specific error message for timeout
      if (error instanceof Error && error.message === "request timed out") {
        console.error("❌ The request took too long. please try again!");
      } else {
        console.error("❌ Something went wrong! try again?");
      }
    }
  };

  if (pet.evolutionIds.includes(EvolutionId.RIP)) {
    return (
      <div className="flex w-full h-full">
        <Window title={`${pet.name} has died :(`}>
          <p>maybe you should take better care of them next time...</p>
          <div className="flex flex-col">
            <a href="/create">adopt a new pet</a>
            <a onClick={() => window.location.reload()} className="underline">
              use dark magic to revive {pet.name}
            </a>
          </div>
        </Window>
      </div>
    );
  }

  if (!dilemma) {
    return null;
  }

  return (
    <div className="flex w-full h-50">
      <WindowTextarea
        title={`help ${pet.name} ! ! ! (；￣Д￣)`}
        placeholder={`as ${pet.name}'s caretaker, explain your advice...`}
        handleSubmit={handleSubmit}
      >
        <p>
          {dilemmas[dilemma.id]?.text.replace("{pet}", pet.name) ||
            "Loading dilemma..."}
        </p>
      </WindowTextarea>
    </div>
  );
}
