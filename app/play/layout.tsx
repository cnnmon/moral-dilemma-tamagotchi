import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "../ConvexClientProvider";
import { PetProvider } from "../providers/PetProvider";

export const metadata: Metadata = {
  title: "principal",
  description: "moral dilemma tamagotchi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <ConvexClientProvider>
        <PetProvider>{children}</PetProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
