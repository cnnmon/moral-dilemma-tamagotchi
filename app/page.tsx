"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};

  if (viewer === undefined || numbers === undefined) {
    return null;
  }

  return (
    <>
      <Image src="/birb_smol.gif" alt="birb" width={200} height={200} />
      <div className="fixed bottom-0 right-0 px-4 py-2">
        <SignOutButton>
          <a className="cursor-pointer">log out</a>
        </SignOutButton>
      </div>
    </>
  );
}
