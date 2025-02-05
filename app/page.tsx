"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Doc, Id } from "@/convex/_generated/dataModel";

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

function DilemmaPrompt({
  pet,
  dilemma,
  onAnswered,
}: {
  pet: Doc<"pets">;
  dilemma: Dilemma;
  onAnswered: () => void;
}) {
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitResponse = useMutation(api.dilemmas.processDilemma);
  const [clarifyingQuestion, setClarifyingQuestion] = useState<
    string | undefined
  >();
  const [currentDilemmaId, setCurrentDilemmaId] = useState<
    string | undefined
  >();

  // subscribe to updates for the current dilemma
  const dilemmaUpdate = useQuery(
    api.dilemmas.getDilemmaById,
    currentDilemmaId
      ? { dilemmaId: currentDilemmaId as Id<"dilemmas"> }
      : "skip"
  );

  // when we get an update and it's resolved, show the outcome
  useEffect(() => {
    if (!dilemmaUpdate) {
      return;
    }

    if (dilemmaUpdate.resolved && dilemmaUpdate.outcome) {
      if (!dilemmaUpdate.ok) {
        // show clarifying question
        setClarifyingQuestion(dilemmaUpdate.outcome);
        toast.info(dilemmaUpdate.outcome, {
          position: "bottom-center",
          className: "font-pixel",
        });
      } else {
        // clear input and show success
        setResponse("");
        setClarifyingQuestion(undefined);
        setCurrentDilemmaId(undefined);
        toast.success(dilemmaUpdate.outcome, {
          position: "bottom-center",
          className: "font-pixel",
        });
        // notify parent that dilemma was answered
        onAnswered();
      }
    }
  }, [dilemmaUpdate, onAnswered]);

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

      // store the dilemma id to subscribe to updates
      setCurrentDilemmaId(result.dilemmaId);
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
      <div className="text-center">
        {dilemma.text.replace(/{name}/g, pet.name)}
      </div>
      {clarifyingQuestion && (
        <div className="text-center text-orange-500 font-pixel">
          {clarifyingQuestion}
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
  const petResponse = useQuery(api.pets.getPetStatus);
  const [currentDilemma, setCurrentDilemma] = useState<Dilemma | null>(null);

  // when we get a new dilemma from the query, store it if we don't have one
  useEffect(() => {
    if (!currentDilemma && result?.status === "has_dilemma" && result.dilemma) {
      setCurrentDilemma(result.dilemma);
    }
  }, [result, currentDilemma]);

  // callback to clear the current dilemma when successfully answered
  const onDilemmaAnswered = () => {
    setCurrentDilemma(null);
  };

  if (result === undefined || petResponse === undefined) {
    return null;
  }

  if (!petResponse?.pet) {
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
        {result.status === "has_dilemma" &&
          (currentDilemma || result.dilemma) && (
            <>
              {petResponse?.pet && (
                <div className="text-center">
                  <h1 className="text-2xl font-bold">{petResponse.pet.name}</h1>
                  <p className="text-gray-600">{petResponse.pet.personality}</p>
                </div>
              )}
              <DilemmaPrompt
                pet={petResponse.pet}
                dilemma={currentDilemma || result.dilemma}
                onAnswered={onDilemmaAnswered}
              />
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
