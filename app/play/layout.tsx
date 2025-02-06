import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "../ConvexClientProvider";
import { Toaster } from "sonner";
import { Footer } from "./components/Footer";

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
    <>
      <ClerkProvider dynamic>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </ClerkProvider>
      <Footer />
      <Toaster />
    </>
  );
}
