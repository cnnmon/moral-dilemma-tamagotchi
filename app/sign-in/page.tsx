"use client";

import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignInButton mode="modal">
        <Image
          src="/egg.gif"
          alt="Sign in with egg"
          width={200}
          height={200}
          priority
        />
        <button className="cursor-pointer transition-transform hover:scale-105">
          <p className="text-center mt-4">click the egg to sign in</p>
        </button>
      </SignInButton>
    </div>
  );
}
