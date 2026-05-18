import type { Metadata } from "next";
import { ConvexClientProvider } from "../ConvexClientProvider";

export const metadata: Metadata = {
  title: "principal",
  description: "moral dilemma tamagotchi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
