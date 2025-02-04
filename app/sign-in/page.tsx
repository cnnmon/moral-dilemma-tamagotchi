"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // redirect to home if already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  // if signed in, don't show sign in page while redirecting
  if (isSignedIn) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/egg.gif"
        alt="Sign in with egg"
        width={200}
        height={200}
        priority
      />
      <SignInButton
        mode="modal"
        fallbackRedirectUrl={"/"}
        signUpForceRedirectUrl={"/"}
      >
        <button className="cursor-pointer transition-transform hover:scale-105">
          <p className="text-center mt-4">click the egg to sign in</p>
        </button>
      </SignInButton>
    </div>
  );
}
