"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function CreatePage() {
  const [name, setName] = useState("");
  const createPet = useMutation(api.pets.createPet);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">name your pet</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          localStorage.clear(); // clear local storage
          await createPet({ name });
          window.location.href = "/play";
        }}
      >
        <input
          className="border-2 border-black p-2"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          placeholder="pet name"
        />
        <button
          type="submit"
          className="bg-black text-white p-2 hover:bg-zinc-800"
        >
          create pet
        </button>
      </form>
    </div>
  );
}
