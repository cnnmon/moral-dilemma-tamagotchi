"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { TextInput } from "./components/TextInput";

export default function Play() {
  const stateResult = useQuery(api.state.getActiveGameState);

  if (stateResult === undefined) {
    return null;
  }

  const { status } = stateResult;
  console.log(stateResult);

  // auth state
  if (status === "not_authenticated") {
    window.location.href = "/";
    return null;
  }

  // no pet state
  if (status === "needs_pet") {
    window.location.href = "/create";
    return null;
  }

  if (status === "out_of_dilemmas") {
    return <div>no more dilemmas for now! check back later...</div>;
  }

  // clear current dilemma when answered
  const onDilemmaAnswered = () => {
    console.log("dilemma answered");
  };

  const { dilemma, pet } = stateResult;
  return (
    <div className="flex flex-col items-center gap-8">
      <Image
        src="/birb_smol.gif"
        alt="birb"
        width={200}
        height={200}
        unoptimized
      />

      <div className="text-center">
        <h1 className="text-2xl font-bold">{pet.name}</h1>
        <p className="text-gray-600">{pet.personality}</p>
      </div>

      <div className="text-center">
        {dilemma.text.replace(/{pet}/g, pet.name)}
      </div>

      {status === "has_unresolved_dilemma" && (
        <div className="text-center text-orange-500 font-pixel mt-2">
          {stateResult.question}
        </div>
      )}

      <TextInput dilemma={dilemma} pet={pet} onAnswered={onDilemmaAnswered} />
    </div>
  );
}
