"use client";

import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Authenticated>
        {/* show regular content when authenticated */}
        <header>
          princi(pal)
          <SignIn />
        </header>
        <main>
          <h1>Convex + Next.js + Clerk Auth</h1>
          <SignedInContent />
        </main>
      </Authenticated>

      <Unauthenticated>
        {/* show egg sign in when not authenticated */}
        <div className="flex flex-col items-center justify-center min-h-screen">
          <SignInButton mode="modal">
            <Image
              src="/egg.png"
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
      </Unauthenticated>
    </div>
  );
}

function SignIn() {
  return (
    <div>
      <Authenticated>
        <UserButton afterSignOutUrl="#" />
      </Authenticated>
      <Unauthenticated>
        <SignInButton>
          <button>Sign in</button>
        </SignInButton>
      </Unauthenticated>
    </div>
  );
}

function SignedInContent() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return "loading... (consider a loading skeleton)";
  }

  return (
    <>
      <p>Welcome {viewer ?? "N/A"}!</p>
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
      </p>
      <p>
        <button
          onClick={() => {
            void addNumber({ value: Math.floor(Math.random() * 10) });
          }}
        >
          Add a random number
        </button>
      </p>
      <p>
        Numbers:{" "}
        {numbers?.length === 0
          ? "Click the button!"
          : numbers?.join(", ") ?? "..."}
      </p>
      <p>
        Edit <code>convex/myFunctions.ts</code> to change your backend
      </p>
      <p>
        Edit <code>app/page.tsx</code> to change your frontend
      </p>
      <p>
        See <Link href="/server">the /server route</Link> for an example of
        loading data in a server component
      </p>
      <p>
        Check out{" "}
        <a target="_blank" href="https://docs.convex.dev/home">
          Convex docs
        </a>
      </p>
    </>
  );
}
