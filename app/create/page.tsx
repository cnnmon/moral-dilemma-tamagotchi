"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function CreatePage() {
  const [name, setName] = useState("");
  const petResponse = useQuery(api.pets.getActivePet);
  const createPet = useMutation(api.pets.createPet);

  if (petResponse) {
    window.location.href = "/play";
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">name your pet</h1>
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
          placeholder="pet name"
        />
        <button
          type="submit"
          className="bg-black text-white p-2 hover:bg-gray-800"
        >
          create pet
        </button>
      </form>
    </div>
  );
}
