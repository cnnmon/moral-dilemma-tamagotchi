"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Textarea } from "@/components/Textarea";
import Image from "next/image";
export default function CreatePage() {
  const createPet = useMutation(api.pets.createPet);

  const handleSubmit = async (response: string) => {
    localStorage.clear(); // clear local storage
    await createPet({ name: response });
    window.location.href = "/play";
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full bg-red-500">
      <Image src="/egg.gif" alt="egg" width={100} height={100} />

      <Textarea placeholder="what do you do" handleSubmit={handleSubmit} />
    </div>
  );
}
