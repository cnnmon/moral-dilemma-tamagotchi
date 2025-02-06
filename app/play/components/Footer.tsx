"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { SignOutButton } from "@clerk/nextjs";

export function Footer() {
  const resetGame = useMutation(api.state.resetGame);

  return (
    <div className="fixed bottom-0 right-0 px-4 py-2 gap-2 flex flex-col">
      <SignOutButton
        signOutOptions={{
          redirectUrl: "/",
        }}
      >
        <a className="cursor-pointer">log out</a>
      </SignOutButton>
      <a
        className="cursor-pointer"
        onClick={() => {
          resetGame();
          window.location.href = "/create";
        }}
      >
        reset game
      </a>
    </div>
  );
}
