"use client";

import { SignInButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import HoverText from "@/components/HoverText";

export default function SignInPage() {
  const { isSignedIn } = useAuth();
  const [hoverText, setHoverText] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // if already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/play");
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // return nothing on the server side
  }

  return (
    <>
      <HoverText hoverText={hoverText} />

      <motion.div
        key="sign-in-page"
        className="flex flex-col items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SignInButton
          mode="modal"
          fallbackRedirectUrl="/play"
          signUpForceRedirectUrl="/play"
        >
          <motion.div
            key="sign-in-button"
            className="absolute"
            animate={{
              y: [0, -10], // pan upwards and back
            }}
            transition={{
              duration: 2,
              delay: 0.2,
            }}
          >
            <Image
              src="/egg.gif"
              alt="sign in with egg"
              className="cursor-pointer"
              onMouseEnter={() => setHoverText("pick up the egg?")}
              onMouseLeave={() => setHoverText(null)}
              width={200}
              height={200}
              priority
            />
          </motion.div>
        </SignInButton>
      </motion.div>
    </>
  );
}
