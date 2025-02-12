"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { SignOutButton } from "@clerk/nextjs";

function SettingButtons() {
  const resetGame = useMutation(api.state.resetGame);
  return (
    <div className="fixed bottom-0 flex items-center right-0 px-4 py-2 gap-2">
      <a
        className="cursor-pointer"
        onClick={() => {
          if (window.confirm("Are you sure you want to reset the game?")) {
            resetGame();
            window.location.href = "/create";
          }
        }}
      >
        reset
      </a>
      <SignOutButton
        signOutOptions={{
          redirectUrl: "/",
        }}
      >
        <a className="cursor-pointer">log out</a>
      </SignOutButton>
    </div>
  );
}

export function Footer() {
  return (
    <>
      <div className="fixed bottom-0 flex items-center right-0 px-4 py-2 gap-2">
        <SettingButtons />
      </div>
    </>
  );
}
