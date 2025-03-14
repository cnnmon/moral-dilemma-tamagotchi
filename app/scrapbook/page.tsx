"use client";

import Scrapbook from "./components/Scrapbook";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Window from "@/components/Window";
import Menu from "@/components/Menu";

export default function ScrapbookPage() {
  const petsQuery = useQuery(api.pets.getAllPetsForUser);

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:w-3xl w-full min-h-screen">
      <Menu page="scrapbook" />
      <Window title="family scrapbook" isOpen={true}>
        <div className="flex flex-col items-center justify-center p-4">
          <Scrapbook petsQuery={petsQuery} />
        </div>
      </Window>
    </div>
  );
}
