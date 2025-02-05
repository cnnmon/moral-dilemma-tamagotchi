"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface Dilemma {
  id: string;
  text: string;
  relatedStats: string[];
  stakes: number;
}

function CreatePetForm() {
  const [name, setName] = useState("");
  const createPet = useMutation(api.pets.createPet);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Name Your Pet</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          await createPet({ name });
        }}
      >
        <input
          className="border-2 border-black p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pet name"
        />
        <button
          type="submit"
          className="bg-black text-white p-2 hover:bg-gray-800"
        >
          Create Pet
        </button>
      </form>
    </div>
  );
}

function DilemmaPrompt({ dilemma }: { dilemma: Dilemma }) {
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitResponse = useMutation(api.dilemmas.processDilemma);
  const [petResponse, setPetResponse] = useState<string | undefined>();

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error("please write a response first!");
      return;
    }

    setIsSubmitting(true);
    console.log("🚀 Submitting response:", response);

    try {
      const result = await submitResponse({
        dilemma: {
          title: dilemma.id,
          text: dilemma.text,
        },
        responseText: response.trim(),
      });

      // if we got a response back from the pet, show it
      if (result?.outcome) {
        setPetResponse(result.outcome);
        toast.info(result.outcome, {
          position: "bottom-center",
          className: "font-pixel",
        });
      } else {
        // if no response, clear the input and show success
        setResponse("");
        setPetResponse(undefined);
        toast.success("response processed! ৻(  •̀ ᗜ •́  ৻)", {
          position: "bottom-center",
          className: "font-pixel",
        });
      }
    } catch (error) {
      console.error("❌ Error processing response:", error);
      toast.error("something went wrong! try again?", {
        position: "bottom-center",
        className: "font-pixel",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">{dilemma.text}</div>
      {petResponse && (
        <div className="text-center text-orange-500 font-pixel">
          {petResponse}
        </div>
      )}
      <textarea
        className="w-full resize-none border-2 border-black outline-none p-2"
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        disabled={isSubmitting}
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`bg-black text-white p-2 hover:bg-gray-800 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? "Thinking..." : "Submit"}
      </button>
    </div>
  );
}

export default function Home() {
  const result = useQuery(api.dilemmas.getNextDilemma);
  const pet = useQuery(api.pets.getPetStatus);

  if (result === undefined || pet === undefined) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex flex-col items-center gap-8">
        <Image
          src="/birb_smol.gif"
          alt="birb"
          width={200}
          height={200}
          unoptimized
        />

        {/* Show different content based on status */}
        {result.status === "needs_pet" && <CreatePetForm />}
        {result.status === "has_dilemma" && result.dilemma && (
          <>
            {pet?.pet && (
              <div className="text-center">
                <h1 className="text-2xl font-bold">{pet.pet.name}</h1>
                <p className="text-gray-600">{pet.pet.personality}</p>
              </div>
            )}
            <DilemmaPrompt dilemma={result.dilemma} />
          </>
        )}
        {result.status === "not_authenticated" && (
          <div>Please sign in to play</div>
        )}
      </div>

      <div className="fixed bottom-0 right-0 px-4 py-2">
        <SignOutButton>
          <a className="cursor-pointer">log out</a>
        </SignOutButton>
      </div>
    </div>
  );
}
